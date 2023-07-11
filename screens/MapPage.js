import {ActivityIndicator, Image, StyleSheet, View} from "react-native";
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Permissions from 'expo-permissions'
import {useContext, useEffect, useState} from "react";

import {child, push, ref, update} from 'firebase/database'
import {auth, db, realTimeDatabase} from "../utils/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage/";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {doc, getDoc} from "firebase/firestore";
import plantLocationData from '../assets/plants_location.json'
import PlantContext from "../components/PlantContext";
import {heightPercentageToDP} from "react-native-responsive-screen";


const LOCATION_TRACKING = 'location-tracking'

const parkCenter = {
    latitude: 27.745515,
    longitude: -15.598140,
}

const zone1Radius = 250
const zone2Radius = 3000
const zone3Radius = 10000
const zone4Radius = 25000
const zone5Radius = 50000

const zones = [
    {
        radius: zone1Radius,
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        distanceInterval: 5
    },
    {
        radius: zone2Radius,
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 15
    },
    {
        radius: zone3Radius,
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 20000,
        distanceInterval: 40
    },
    {
        radius: zone4Radius,
        accuracy: Location.Accuracy.Low,
        timeInterval: 40000,
        distanceInterval: 80
    },
    {
        radius: zone5Radius,
        accuracy: Location.Accuracy.Lowest,
        timeInterval: 60000,
        distanceInterval: 100
    }
]


let currentZoneIndex = 0

let timer = null

let currentPosition = parkCenter


const startTimer = () => {
    timer = setTimeout(() => {
        handleZoneDeactivation().catch((error) => {
            console.log("handleZoneDeactivationError:", error)
        })
    }, 3 * 60 * 60 * 1000)
}

const stopTimer = () => {
    clearTimeout(timer)
}

const handleZoneDeactivation = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING)
    if (currentZoneIndex < 2) {
        stopTimer()
    }
}

const handlePrevZoneActivation = async () => {
    await handleZoneDeactivation()
    currentZoneIndex -= 1
    let zone = zones[currentZoneIndex]
    startLocationTracking(zone.accuracy, zone.timeInterval, zone.distanceInterval).catch((error) => {
        console.log("startLocationTrackingError:", error)
    })
}

const handleNextZoneActivation = async () => {
    await handleZoneDeactivation()
    currentZoneIndex += 1
    if (currentZoneIndex < 5) {
        let zone = zones[currentZoneIndex]
        startLocationTracking(zone.accuracy, zone.timeInterval, zone.distanceInterval).catch((error) => {
            console.log("startLocationTrackingError:", error)
        })
    }

}

const startLocationTracking = async (accuracy, timeInterval, distanceInterval) => {
    if (currentZoneIndex < 3) {
        startTimer()
    }
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: accuracy,
        timeInterval: timeInterval,
        distanceInterval: distanceInterval,
    })
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING)
    console.log('tracking started?', hasStarted)
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371 * 1000
    const latRad1 = toRadians(lat1)
    const lonRad1 = toRadians(lon1)
    const latRad2 = toRadians(lat2)
    const lonRad2 = toRadians(lon2)

    const deltaLat = latRad2 - latRad1
    const deltaLon = lonRad2 - lonRad1
    //Haversine
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(latRad1) * Math.cos(latRad2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadius * c
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

let asyncStorageTimer = null
const startAsyncStorageTimer = () => {
    clearTimeout(asyncStorageTimer)
    asyncStorageTimer = setTimeout(() => {
        handleUploadRealTimeDatabase().catch((error) => {
            console.log("handleUploadRealTimeDatabaseError:", error)
        })
        startAsyncStorageTimer()

    }, 5 * 60 * 1000)
}

const handleUploadRealTimeDatabase = async () => {
    try {
        const jsonData = await AsyncStorage.getItem('geolocationData')
        if (jsonData) {
            const updates = {};
            const data = JSON.parse(jsonData)
            const newGPSKey = push(child(ref(realTimeDatabase), '/user-GPS-data/' + auth.currentUser.uid)).key
            updates['/user-GPS-data/' + auth.currentUser.uid + '/' + newGPSKey] = data
            await update(ref(realTimeDatabase), updates)
            console.log("Datos sincronizacos con Firebase")
            await AsyncStorage.removeItem('geolocationData')
            console.log("Datos locales eliminados")
        }
    } catch (error) {
        console.error("Error al sincronizar los datos con Firebase:", error)
    } finally {
        clearTimeout(asyncStorageTimer)
        startAsyncStorageTimer()
    }

}

export default function MapPage() {
    const {user, scannedPlants} = useContext(PlantContext)
    const [userPlants, setUserPlants] = useState([])

    useEffect(() => {
        const config = async () => {
            let res_foreground = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND)
            let res_background = await Permissions.askAsync(Permissions.LOCATION_BACKGROUND)
            if (res_foreground.granted) {
                console.log("Se ha dado el permiso foreground")
            } else {
                console.log("No se ha dado el permiso foreground")
            }
            if (res_background.granted) {
                console.log("Se ha dado el permiso background")
            } else {
                console.log("No se ha dado el permiso background")
            }

            if (res_foreground.granted) { //&& res_background.granted
                let zone = zones[currentZoneIndex]
                startLocationTracking(zone.accuracy, zone.timeInterval, zone.distanceInterval).catch((error) => {
                    console.log('StartLocationTrackingError:', error)
                })
            } else {
                let res_foreground = await Location.getForegroundPermissionsAsync()
                console.log(res_foreground.canAskAgain)
            }
        }
        let scannedPlantsData = []

        const fetchUserPlants = async () => {
            console.log("que loco")
            const userDoc = await getDoc(doc(db, "users", user.uid));
            scannedPlantsData = await userDoc.data()["scannedPlants"];
            setUserPlants(scannedPlantsData);
        }
        config().catch((error) => {
            console.log('ConfigLocationTrackingError:', error)
        })
        fetchUserPlants().catch((error) => {
            console.log('FetchingUserPlantsError:', error)
        })

    }, [])

    if (userPlants.length === 0 && scannedPlants > 0) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00DAE8" style={{position: "absolute", alignSelf: "center"}}/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.mapContainer}
                initialRegion={{
                    latitude: parkCenter.latitude,
                    longitude: parkCenter.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.004
                }}
                provider={PROVIDER_GOOGLE}
            >
                <Marker coordinate={
                    currentPosition
                }>
                    <Image source={require("../assets/images/map/person-walking.gif")}
                           resizeMode="contain"
                           style={{height: heightPercentageToDP(5), width: heightPercentageToDP(5)}}/>
                </Marker>

                {Object.keys(plantLocationData).map((plant, index) => (

                    <Marker
                        key={index}
                        coordinate={
                            {
                                latitude: plantLocationData[plant].latitude,
                                longitude: plantLocationData[plant].longitude
                            }
                        }>
                        <Image
                            source={userPlants.includes(plant) ? require("../assets/images/map/plant-icon-visited.png") :
                                require("../assets/images/map/plant-icon-no-visited.png")}
                            resizeMode="center"
                            resizeMethod="resize"
                            style={{height: heightPercentageToDP(3), width: heightPercentageToDP(3)}}

                        />

                    </Marker>

                ))}

            </MapView>
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        width: '100%',
        height: '100%',
    }

})

TaskManager.defineTask(LOCATION_TRACKING, async ({data, error}) => {
    if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error)
        return
    }
    if (data) {
        const {locations} = data
        let lat = locations[0].coords.latitude
        let long = locations[0].coords.longitude
        let date = new Date(Date.now()).toLocaleString()
        if (asyncStorageTimer == null) startAsyncStorageTimer()
        const saveDataLocally = async (data) => {
            try {
                const existingDataJson = await AsyncStorage.getItem('geolocationData')
                let existingData = existingDataJson ? JSON.parse(existingDataJson) : []
                existingData = existingData.concat(data)
                const jsonData = JSON.stringify(existingData)
                await AsyncStorage.setItem('geolocationData', jsonData)
                console.log("Datos guardados localmente")

            } catch (error) {
                console.error("Error al guardar los datos localmente:", error)
            }
        }

        currentPosition = {
            latitude: lat,
            longitude: long
        }


        console.log(date + ": " + lat, long)
        saveDataLocally({lat, long, date}).catch(() => {
            console.error("Error al guardar los datos localmente")
        })
        let distance = calculateDistance(parkCenter.latitude, parkCenter.longitude, lat, long)

        if (distance > zones[currentZoneIndex].radius) {
            handleNextZoneActivation().catch((error) => {
                console.log("handleNextZoneActivationError:", error)
            })
        } else if (currentZoneIndex > 0) {
            if (distance <= zones[currentZoneIndex - 1].radius) {

                handlePrevZoneActivation().catch((error) => {

                    console.log("handlePrevZoneActivationError:", error)
                })
            }
        }

    }
})