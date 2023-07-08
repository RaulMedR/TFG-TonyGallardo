import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../utils/firebaseConfig";
import {useContext, useEffect, useState} from "react";
import CustomCard from "../components/CustomCard";
import PlantContext from "../components/PlantContext";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text";


export default function PlantsDirectoryPage({navigation}) {
    const {user, totalPlants, scannedPlants, setScannedPlants} = useContext(PlantContext)
    const [plants, setPlants] = useState([])
    const [userPlants, setUserPlants] = useState([])
    const [plantReminderHeight, setPlantReminderHeight] = useState(hp(40))
    const [prevUserPlantsValue, setPrevUserPlantsValue] = useState(0)
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        let scannedPlantsData = []
        const fetchUserPlants = async () => {
            if(userPlants.length === 0){
                setLoading(true)

            }
            const userDoc = await getDoc(doc(db, "users", user.uid));
            scannedPlantsData = await userDoc.data()["scannedPlants"];
            setUserPlants(scannedPlantsData);
            if (scannedPlantsData.length > 0) {
                setPlantReminderHeight(hp(20));
            } else {
                setPlantReminderHeight(hp(72));
            }

        }

        if (user) {
            fetchUserPlants().catch((error) => {
                console.error("Error al obtener los datos del usuario:", error);
            });
        }

    }, [scannedPlants]);

    useEffect(() => {
        const fetchPlants = async () => {
            const promises = userPlants.map((value) => {
                return getDoc(doc(db, "plants", value)).then((plant) => {
                    return {id: plant.id, ...plant.data()};
                })
            })
            const resolvedPlants = await Promise.all(promises);
            setPlants(resolvedPlants);
            setLoading(false)
        }

        if (userPlants.length !== prevUserPlantsValue) {
            setScannedPlants(userPlants.length)
            setPrevUserPlantsValue(userPlants.length)
            fetchPlants().catch((error) => {
                console.error("Error al obtener los datos del usuario:", error);
            });
        }

    }, [userPlants]);


    const renderPlantCard = (plant, index) => {
        const color = index % 2 === 0 ? "#52E23E" : "#00DAE8"
        const cardStyle = index % 2 === 0 ? styles.evenCard : styles.oddCard

        return (
            <CustomCard key={plant.id} cardStyle={cardStyle} color={color} plant={plant} navigation={navigation}
                        destination={"PlantDetail"}/>
        )
    }

    return (
        <View style={styles.container}>

            <View style={styles.cornerContainer}>
                <View style={styles.cornerCircle}/>
            </View>
            <Pressable style={styles.qrIconContainer} onPress={() => {
                navigation.navigate("QrScan", {origin: "PlantsDirectoryPage"})

            }}>
                <Image style={styles.qrIcon} source={require("../assets/images/qr-icon.png")}
                       resizeMode={"contain"}/>
            </Pressable>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>¡Pasea y</Text>
                <Text style={styles.title}>desbloquea!</Text>

            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00DAE8" style={{position: "absolute", alignSelf: "center"}}/>
            ) : (
                <>

                    <ScrollView style={styles.plantsContainer} alwaysBounceVertical={false}>
                        {plants.map((plant, index) => renderPlantCard(plant, index)
                        )}
                        {
                            scannedPlants < totalPlants && (
                                <View style={[styles.plantReminder, {height: plantReminderHeight}]}>
                                    <AutoSizeText style={styles.textReminder} parentWidth={wp(90)}
                                                  numberOfLines={1}
                                                  mode={ResizeTextMode.group}>¡Todavía te quedan plantas por
                                        ver!</AutoSizeText>
                                    <Pressable style={styles.qrIconContainerReminder} onPress={() => {
                                        navigation.navigate("QrScan", {origin: "PlantsDirectoryPage"})
                                    }}>
                                        <Image source={require("../assets/images/qr-icon.png")} resizeMode={"contain"}/>
                                    </Pressable>

                                </View>
                            )
                        }
                    </ScrollView>

                </>
            )}
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
    plantsContainer: {
        display: "flex",
        flexDirection: "column",
        marginTop: hp(24)
    },
    plantReminder: {
        display: "flex",
        width: wp(100),
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(10)
    },
    textReminder: {
        fontFamily: "OpenSans-Bold",
        fontSize: 20,
        marginBottom: hp(2)

    },
    qrIconContainerReminder: {
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
        alignItems: "center",
    },
    evenCard: {
        marginRight: wp(20)
    },
    oddCard: {
        alignSelf: "flex-end"
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