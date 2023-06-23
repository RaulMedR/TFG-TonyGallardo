import {BackHandler, Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {db} from "../utils/firebaseConfig";
import {useFocusEffect} from "@react-navigation/native";
import CustomNewsCard from "../components/CustomNewsCard";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import ScannedPlantsDropdown from "../components/ScannedPlantsDropdown";

export default function MainPage({navigation}) {
    const [lastNew, setLastNew] = useState(null)

    useEffect(() => {
        const q = query(collection(db, "news"), orderBy("date", "desc"), limit(1))
        getDocs(q).then((doc) => {
            doc.docs.forEach((news) => {

                setLastNew({id: news.id, ...news.data()})
            })
        })


    }, []);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                BackHandler.exitApp();
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => backHandler.remove();
        }, [])
    );


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>¡Pasea,</Text>
                <Text style={styles.titleText}>escanea y</Text>
                <Text style={styles.titleText}>desbloquea!</Text>
            </View>
            <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.mainContainer}>

                    <View style={styles.newsContainer}>
                        {lastNew ? (

                            <CustomNewsCard news={lastNew}/>
                        ) : (
                            <View>
                            </View>
                        )}
                    </View>

                    <ScannedPlantsDropdown navigation={navigation}/>


                    <Pressable style={styles.qrIconContainer} onPress={() => {
                        navigation.navigate("QrScanPage", {origin: "MainLoggedPage"})
                    }}>
                        <Image source={require("../assets/images/qr-icon.png")} style={styles.qrImage} resizeMode={"contain"}/>
                    </Pressable>

                </View>
            </ScrollView>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
    },

    titleContainer: {
        paddingTop: hp(5),
        paddingLeft: wp(3),
        paddingBottom: hp(2),
    },
    titleText: {
        fontSize: 40,
        fontFamily: "Roboto-Regular",
        color: "#A8A8A8"
    },
    mainContainer: {
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        paddingBottom: hp(15),
    },
    scrollViewContent: {
        flexGrow: 2,
    },
    newsContainer: {
        height: hp(20),
    },
    qrIconContainer: {
        width: wp(24),
        height: wp(24),
        borderRadius: wp(15),
        backgroundColor: "#B6FFB6",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    qrImage: {
        width: wp(12),
        height: wp(12)
    }
})