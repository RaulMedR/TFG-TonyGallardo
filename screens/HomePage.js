import {Image, StyleSheet, Text, View} from "react-native";
import {useFonts} from "expo-font";
import {useCallback} from "react";
import * as SplashScreen from 'expo-splash-screen';
import CustomBlueButton from "../components/CustomBlueButton";
import CustomGreenButton from "../components/CustomGreenButton";
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from "../utils/firebaseConfig";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

SplashScreen.preventAutoHideAsync();
export default function HomePage({navigation}) {
    let [fontsLoaded] = useFonts({
        "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
        "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
        "Lobster-Regular": require("../assets/fonts/Lobster-Regular.ttf")
    })
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])
    if (!fontsLoaded) {
        return null;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            navigation.navigate("Main")
        }
    })
    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <Image style={styles.logoImage} source={require("../assets/images/logo-app.png")} resizeMode={"contain"}/>
            <Text style={styles.normalText}>¿Nuevo en el parque?</Text>
            <CustomBlueButton title={"Registrarse"}
                              onPress={() => navigation.navigate("Register")}
            />
            <Text style={styles.normalText}>¿Ha estado aquí antes?</Text>
            <CustomGreenButton title={"Iniciar sesión"}
                               onPress={() => navigation.navigate("Login")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        aspectRatio: 1,
        height: hp(70),

    },
    normalText: {
        fontFamily: "OpenSans-Regular",
        fontStyle: "normal",
        fontSize: 22,

    }
});