import {BackHandler, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {db} from "../utils/firebaseConfig";
import {useFocusEffect} from "@react-navigation/native";
import CustomNewsCard from "../components/CustomNewsCard";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
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
            <View style={styles.mainContainer}>

                <View style={styles.newsContainer}>
                    {lastNew ? (

                        <CustomNewsCard news={lastNew}/>
                    ) : (
                        <View>
                        </View>
                    )}
                </View>


                <Pressable style={styles.qrIconContainer} onPress={() => {
                    navigation.navigate("QrScanPage", {origin: "MainLoggedPage"})
                }}>
                    <Image source={require("../assets/images/qr-icon.png")} resizeMode={"contain"}/>
                </Pressable>

            </View>
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
        height: hp(50),
        display: "flex",
        alignItems: "center"
    },
    newsContainer: {
        height: hp(20),

    },
    qrIconContainer: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        backgroundColor: "#B6FFB6",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})