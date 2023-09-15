import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)
export const realTimeDatabase = getDatabase(app);
