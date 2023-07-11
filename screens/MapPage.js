import {ActivityIndicator, Image, Pressable, StyleSheet, Text, View} from "react-native";
import * as TaskManager from 'expo-task-manager'
import * as Permissions from 'expo-permissions'
import {useContext, useEffect, useState} from "react";
import {db} from "../utils/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage/";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {doc, getDoc} from "firebase/firestore";
import plantLocationData from '../assets/plants_location.json'
import PlantContext from "../components/PlantContext";
import {
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import {
    asyncStorageTimer,
    calculateDistance,
    currentZoneIndex,
    handleNextZoneActivation,
    handlePrevZoneActivation,
    LOCATION_TRACKING,
    parkCenter,
    startAsyncStorageTimer,
    startLocationTracking,
    zones
} from "../utils/LocationUtils";

export default function MapPage({navigation}) {
    const [currentPosition, setCurrentPosition] = useState(parkCenter);
    const {user, scannedPlants} = useContext(PlantContext)
    const [userPlants, setUserPlants] = useState([])

    useEffect(() => {
        const config = async () => {
            TaskManager.defineTask(LOCATION_TRACKING, async ({data, error}) => {
                if (error) {
                    alert(LOCATION_TRACKING + " task error: " + error.message)
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

                        } catch (error) {
                            alert("Error al guardar los datos localmente: " + error.message)
                        }
                    }

                    setCurrentPosition({
                        latitude: lat,
                        longitude: long
                    })




                    void saveDataLocally({lat, long, date})
                    let distance = calculateDistance(parkCenter.latitude, parkCenter.longitude, lat, long)

                    if (distance > zones[currentZoneIndex].radius) {
                        void handleNextZoneActivation()
                    } else if (currentZoneIndex > 0) {
                        if (distance <= zones[currentZoneIndex - 1].radius) {
                            void handlePrevZoneActivation()
                        }
                    }

                }
            })

            if(!TaskManager.isTaskDefined(LOCATION_TRACKING)){
                return void config()
            }

            let res_foreground = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND)
            let res_background = await Permissions.askAsync(Permissions.LOCATION_BACKGROUND)

            alert("¿Se han dado ambos permisos de localizacion? " + res_foreground.granted + ":" + res_background.granted)

            if (res_foreground.granted && res_background.granted) {
                let zone = zones[currentZoneIndex]
                startLocationTracking(zone.accuracy, zone.timeInterval, zone.distanceInterval).catch(() => {
                    alert("Error al activar la geolocalización")
                })
            } else {
                alert("Es necesario que active la ubicación para que el mapa funcione correctamente")
            }
        }
        let scannedPlantsData = []

        const fetchUserPlants = async () => {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            scannedPlantsData = await userDoc.data()["scannedPlants"];
            setUserPlants(scannedPlantsData);
        }
        void config()
        void fetchUserPlants()

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
            <View style={styles.cornerContainer}>
                <View style={styles.cornerCircle}/>
            </View>
            <Pressable style={styles.qrIconContainer} onPress={() => {
                navigation.navigate("QrScanFromMap", {origin: "MapPage"})

            }}>
                <Image style={styles.qrIcon} source={require("../assets/images/qr-icon.png")}
                       resizeMode={"contain"}/>
            </Pressable>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>¡Pasea y</Text>
                <Text style={styles.title}>escanea!</Text>

            </View>
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
        width: wp(95),
        height: heightPercentageToDP(65),
        borderRadius: wp(5),
        top: hp(5),
        borderColor: "#00DAE8",
        borderWidth: 1,
    },
    titleContainer: {
        position: "absolute",
        top: hp(5),
        width: wp(65),
        left: wp(3),
    },
    qrIconContainer: {
        position: "absolute",
        top: wp(11),
        right: wp(5),
    },
    qrIcon: {
        height: wp(18),
        width: wp(18),

    },
    title: {
        fontSize: 40,
        fontFamily: "Roboto-Regular",
        color: "#A8A8A8"
    },
    cornerContainer: {
        position: "absolute",
        top: -wp(40),
        right: -wp(40),
        width: wp(80),
        height: wp(80),
        justifyContent: "center",
        alignItems: "center",
    },
    cornerCircle: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(40),
        backgroundColor: "#B6FFB6"
    }

})

