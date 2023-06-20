import {createContext, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../utils/firebaseConfig";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";


const PlantContext = createContext()

export const PlantProvider = ({children}) => {
    const [scannedPlants, setScannedPlants] = useState(0)
    const [user, setUser] = useState(null)
    const [totalPlants, setTotalPlants] = useState(0)

    onAuthStateChanged(auth, async (user) => {
        setUser(user)
        setTotalPlants((await getDocs(collection(db, "plants")))?.docs?.length)
        setScannedPlants((await getDoc(doc(db, "users", user.uid)))?.data()["scannedPlants"]?.length)

    })

    return(
        <PlantContext.Provider value={{scannedPlants, setScannedPlants, totalPlants, setTotalPlants, user, setUser}}>
            {children}
        </PlantContext.Provider>
    )
}
export default PlantContext
