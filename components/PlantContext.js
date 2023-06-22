import {createContext, useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../utils/firebaseConfig";
import {collection, doc, getDoc, getCountFromServer} from "firebase/firestore";


const PlantContext = createContext()

export const PlantProvider = ({children}) => {
    const [scannedPlants, setScannedPlants] = useState(0)
    const [user, setUser] = useState(null)
    const [totalPlants, setTotalPlants] = useState(0)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const scannedPlantsData = userDoc.data()["scannedPlants"];
                setScannedPlants(scannedPlantsData.length);
            } else {
                setUser(null);
                setScannedPlants(0);
            }
        });

        return () => unsubscribe(); // Se cancela el listener al desmontar el componente
    }, []);

    useEffect(() => {
        const plantsCollection = collection(db, "plants")
        getCountFromServer(plantsCollection).then((count) => {
            setTotalPlants(count.data().count)
        })
    }, []);

    return(
        <PlantContext.Provider value={{scannedPlants, setScannedPlants, totalPlants, setTotalPlants, user, setUser}}>
            {children}
        </PlantContext.Provider>
    )
}
export default PlantContext
