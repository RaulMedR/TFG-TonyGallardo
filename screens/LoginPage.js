import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import CustomGreenButton from "../components/CustomGreenButton";
import {useState} from "react";
import {auth} from "../utils/firebaseConfig";
import Toast from "react-native-root-toast";
import {signInWithEmailAndPassword} from 'firebase/auth'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export default function LoginPage({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            Toast.show('Ha iniciado sesión correctamente', {
                duration: Toast.durations.SHORT
            })
            navigation.navigate("Main")
        } catch (error) {
            Toast.show('Ha habido algún error: ' + error.toString(), {
                duration: Toast.durations.LONG
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.titlesView}>
                <Text style={styles.title1}>¡Te echábamos de menos!</Text>
                <Text style={styles.title2}>¡Vamos a seguir explorando juntos!</Text>

            </View>
            <TextInput autoCapitalize={"none"} value={email} onChangeText={setEmail} textContentType={"emailAddress"}
                       style={styles.textInput} placeholder={"correo electrónico"}/>
            <TextInput autoCapitalize={"none"} value={password} onChangeText={setPassword} secureTextEntry={true}
                       textContentType={"password"} style={styles.textInput} placeholder={"contraseña"}/>
            <CustomGreenButton title={"Iniciar sesión"} onPress={handleLogin}/>
            <Text style={styles.normalText}>¿No tiene cuenta?</Text>
            <Pressable onPress={() => {
                navigation.navigate("Register")
            }}>
                <Text style={styles.buttonText}>Regístrate</Text>
            </Pressable>
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
    titlesView: {
        justifyContent: "center",
        alignItems: "center",
        maxWidth: wp(95),
        marginBottom: hp(5)
    },
    title1: {
        fontFamily: "Lobster-Regular",
        color: "#00DAE8",
        fontSize: 40,
        marginBottom: 28,
        textAlign: "center"
    },
    title2: {
        fontFamily: "Roboto-Bold",
        fontSize: 25,
        textAlign: "center",
        color: "#A8A8A8"

    },
    normalText: {
        fontFamily: "OpenSans-Regular",
        fontStyle: "normal",
        fontSize: 24.4,

    },
    buttonText: {
        fontFamily: "OpenSans-Regular",
        fontStyle: "normal",
        fontSize: 24.4,
        color: "#00DAE8"
    },
    textInput: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: "#52E23E",
        backgroundColor: "#F8F8F8",
        width: wp(85),
        height: wp(85) * 0.2,
        paddingLeft: 22,
        paddingRight: 22,
        fontStyle: "normal",
        fontFamily: "OpenSans-Regular",
        fontSize: 20,
        marginBottom: hp(3),
    }
});