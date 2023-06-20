import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'
import {getFirestore} from 'firebase/firestore'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyAsVnodbOxHIosAmLNtuZECEx-4rM_nV3Q",
    authDomain: "tfg-tonygallardo.firebaseapp.com",
    projectId: "tfg-tonygallardo",
    storageBucket: "tfg-tonygallardo.appspot.com",
    messagingSenderId: "996558129917",
    appId: "1:996558129917:web:9f35e52bf9c9992bcc4c94",
    measurementId: "G-6SDP4NPXP0",
    databaseURL: "https://tfg-tonygallardo-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const realTimeDatabase = getDatabase(app);
