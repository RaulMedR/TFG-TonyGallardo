import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import PlantContext from "../context/PlantContext";
import {auth, db} from "../utils/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import CustomCard from "./CustomCard";

export default function ScannedPlantsDropdown({navigation}) {
    const {scannedPlants, totalPlants} = useContext(PlantContext);
    const [scannedPlantsData, setScannedPlantsData] = useState([]);
    const [dropdownActivated, setDropdownActivated] = useState(true);
    const [loading, setLoading] = useState(true);
    const [dropdownHeight, setDropdownHeight] = useState(0)

    useEffect(() => {
        setDropdownHeight(Math.min(62, scannedPlants * 20 + 10))
        getDoc(doc(db, "users", auth.currentUser.uid)).then(async (userDoc) => {
            const userData = userDoc.data();
            const lastThreePlants = userData.scannedPlants.slice(-3);
            const plantsData = await Promise.all(
                lastThreePlants.map(async (value) => {
                    const plantDoc = await getDoc(doc(db, "plants", value));
                    return {id: plantDoc.id, ...plantDoc.data()};
                })
            );
            setScannedPlantsData(plantsData);
            setLoading(false)
        });
    }, [scannedPlants]);

    const toggleDropdown = () => {
        setDropdownActivated(!dropdownActivated)
    };

    return (
        <View style={[styles.wrapperContainer,(scannedPlants > 0) && dropdownActivated && {height: hp(dropdownHeight)}]}>
            {loading ? (
                <ActivityIndicator size="large" color="#00DAE8" style={{position: "absolute", alignSelf: "center"}}/>
            ) : (

            <View style={styles.scannedContainer}>
                <View style={styles.scannedHeaderContainer}>
                    <Text style={styles.scannedTitle}>Plantas</Text>
                    <View style={styles.scannedTextContainer}>
                        <Text style={styles.scannedTextNumber}>{scannedPlants.toString()}</Text>
                        <Text style={styles.scannedTextNumber}>/</Text>
                        <Text style={styles.scannedTextNumber}>{totalPlants.toString()}</Text>
                    </View>
                </View>

                <Pressable onPress={toggleDropdown}>
                    <Image
                        source={require("../assets/images/arrow-icon.png")}
                        style={[styles.arrowImage, dropdownActivated && styles.imageFlipped]}
                        resizeMode="contain"
                    />
                </Pressable>

                {dropdownActivated && (
                    <View style={styles.dropdownContent}>
                        {scannedPlantsData.map((value, index) => (
                            <CustomCard key={index} plant={value} color="#52E23E" navigation={navigation} destination={"PlantDetailPage"}/>
                        ))}
                    </View>
                )}
            </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapperContainer: {
        display: "flex",
    },
    scannedContainer: {
        width: wp(70),
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        height: wp(85) * 0.3,
        borderRadius: 25,
        borderColor: "#52E23E",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: hp(4),
    },
    scannedHeaderContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    scannedTitle: {
        fontFamily: "OpenSans-Regular",
        fontSize: 20,
    },
    scannedTextContainer: {
        display: "flex",
        flexDirection: "row",
    },
    scannedTextNumber: {
        fontSize: 23,
        fontFamily: "OpenSans-Regular",
        color: "#52E23E",
    },
    arrowImage: {
        height: hp(3),
    },
    imageFlipped: {
        transform: [{rotate: "180deg"}],
    },
    dropdownContent: {
        position: "absolute",
        top: hp(15),
        width: wp(70),
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: hp(2),
        paddingBottom: hp(2),
    },
});