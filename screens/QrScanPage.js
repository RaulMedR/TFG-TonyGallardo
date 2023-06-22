import {StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {BarCodeScanner} from "expo-barcode-scanner";
import {Ionicons} from '@expo/vector-icons'
import {useContext, useEffect, useState} from "react";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {db, storage} from "../utils/firebaseConfig";
import {getDownloadURL, ref} from "firebase/storage";
import PlantContext from "../components/PlantContext";

const scannerAspectRatio = hp(100) / wp(100);

export default function QrScanPage({route, navigation}) {
    const [scannedData, setScannedData] = useState(null)
    const {user, scannedPlants, setScannedPlants} = useContext(PlantContext)
    const [scanningEnabled, setScanningEnabled] = useState(true);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            (async () => {
                if (!scanningEnabled) {
                    navigation.reset()
                }
                const {status} = await BarCodeScanner.requestPermissionsAsync();
                if (status !== 'granted') {
                    alert('Se requiere permiso para acceder a la cámara.');
                }
            })();
        })
    }, [navigation]);

    const handleBarCodeScanned = async ({type, data}) => {
        let scanned = false
        if (scanningEnabled) {
            if (typeof type === "number") {
                setScannedData(data);
                setScanningEnabled(false)
                scanned = true
            }
            if (data && scanned) {
                await updateDoc(doc(db, "users", user.uid), {
                    scannedPlants: arrayUnion(data)
                })
                setScannedPlants(scannedPlants + 1)
                const photoUrl = await getDownloadURL(ref(storage, 'plants/' + data + '.jpg'))
                getDoc(doc(db, "plants", data)).then((doc) => {
                    navigation.navigate("PlantDetail", {
                        plant: doc.data(),
                        photo: photoUrl,
                        fromQrScanPage: true,
                        origin: route.params.origin
                    })
                })
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>¡Escanea y</Text>
                <Text style={styles.titleText}>desbloquea!</Text>
            </View>
            <View style={styles.cameraContainer}>
                <View style={styles.cameraWrapper}>
                    <BarCodeScanner style={StyleSheet.absoluteFillObject}
                                    ratio={scannerAspectRatio}
                                    onBarCodeScanned={handleBarCodeScanned}
                                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    />
                </View>
                <View style={styles.overlay}>
                    <View style={styles.scanSquare}/>
                    <Ionicons name="scan" size={60} color="rgba(0, 0, 0, 0.5)" style={styles.scanIcon}/>
                </View>
            </View>
            {scannedData ? (
                <View style={styles.scannedDataContainer}>
                    <Text style={styles.scannedDataText}>{scannedData.toString()}</Text>
                </View>
            ) : (
                <View style={styles.scannedDataContainer}>
                    <Text style={styles.scannedDataPlaceholder}>Escanea un código QR</Text>
                </View>
            )}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
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
    cameraContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginHorizontal: hp(3),
        overflow: "hidden",
        marginBottom: hp(3),

    },
    cameraWrapper: {
        width: '100%',
        height: '100%',
        aspectRatio: scannerAspectRatio,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanSquare: {
        width: wp(50),
        height: wp(50),
        borderWidth: 2,
        borderColor: '#00DAE8',
        borderRadius: 10,
    },
    scanIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: -30}, {translateY: -30}],
    },
    scannedDataContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    scannedDataText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    scannedDataPlaceholder: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'center',
    },
})