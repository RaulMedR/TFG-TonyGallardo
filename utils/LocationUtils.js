import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {child, push, ref, update} from "firebase/database";
import {auth, realTimeDatabase} from "./firebaseConfig";

export const LOCATION_TRACKING = 'location-tracking'

export const parkCenter = {
    latitude: 27.745515,
    longitude: -15.598140,
}

const zone1Radius = 250
const zone2Radius = 3000
const zone3Radius = 10000
const zone4Radius = 25000
const zone5Radius = 50000

export const zones = [
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
export let currentZoneIndex = 0



//LOCATION TIMER
let timer = null
let timerActive = false
const startTimer = () => {
    if(!timerActive){
        timerActive = true
        timer = setTimeout(() => {
            void handleZoneDeactivation()
            timerActive = false
        }, 3 * 60 * 60 * 1000)
    }
}

const stopTimer = () => {
    clearTimeout(timer)
    timerActive = false
}


//LOCATION ACTIVATION AND ZONE MANAGEMENT
export const handleZoneDeactivation = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING)
}

export const handlePrevZoneActivation = async () => {
    await handleZoneDeactivation()
    currentZoneIndex -= 1
    alert ("Se activa zona previa: " + currentZoneIndex)
    let zone = zones[currentZoneIndex]
    void startLocationTracking(zone.accuracy, zone.timeInterval, zone.distanceInterval)
}

export const handleNextZoneActivation = async () => {
    await handleZoneDeactivation()
    currentZoneIndex += 1
    if (currentZoneIndex < 5) {
        alert ("Se activa zona siguiente: " + currentZoneIndex)
        let zone = zones[currentZoneIndex]
        void startLocationTracking(zone.accuracy, zone.timeInterval, zone.distanceInterval)
    }

}

export const startLocationTracking = async (accuracy, timeInterval, distanceInterval) => {
    if (currentZoneIndex > 0) {
        startTimer()
    }
    else {
        stopTimer()
    }
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: accuracy,
        timeInterval: timeInterval,
        distanceInterval: distanceInterval,
    })
}


//CALCULATE DISTANCE
export function calculateDistance(lat1, lon1, lat2, lon2) {
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

//ASYNC STORAGE TIMER
export let asyncStorageTimer = null
export const startAsyncStorageTimer = () => {
    clearTimeout(asyncStorageTimer)
    asyncStorageTimer = setTimeout(() => {
        void handleUploadRealTimeDatabase()
        startAsyncStorageTimer()

    }, 5 * 60 * 1000)
}

//REAL-TIME DATABASE
export const handleUploadRealTimeDatabase = async () => {
    try {
        const jsonData = await AsyncStorage.getItem('geolocationData')
        if (jsonData) {
            const updates = {};
            const data = JSON.parse(jsonData)
            const newGPSKey = push(child(ref(realTimeDatabase), '/user-GPS-data/' + auth.currentUser.uid)).key
            updates['/user-GPS-data/' + auth.currentUser.uid + '/' + newGPSKey] = data
            update(ref(realTimeDatabase), updates).then(() => {
                alert("Datos sincronizacos con Firebase")
                AsyncStorage.removeItem('geolocationData')
                alert("Datos locales eliminados")
            })
        }
    } catch (error) {
        alert("Error al sincronizar los datos con Firebase:" + error)
    } finally {
        clearTimeout(asyncStorageTimer)
        startAsyncStorageTimer()
    }

}