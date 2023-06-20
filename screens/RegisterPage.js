import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import CustomBlueButton from "../components/CustomBlueButton";
import {useState} from "react";
import Toast from "react-native-root-toast";
import {auth} from "../utils/firebaseConfig";
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

export default function RegisterPage({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const handleRegister = async () => {
        if (password !== repeatPassword) {
            Toast.show('Las contraseñas no coinciden', {
                duration: Toast.durations.LONG
            })
        } else {
            try {
                await createUserWithEmailAndPassword(auth, email, password)
                Toast.show('Se ha registrado correctamente', {
                    duration: Toast.durations.SHORT
                })
                navigation.navigate("Main")

            } catch (error) {
                Toast.show('Ha habido algún error: ' + error.toString(), {
                    duration: Toast.durations.LONG
                })
            }
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.titlesView}>
                <Text style={styles.title1}>¡Bienvenido a Tony Gallardo!</Text>
                <Text style={styles.title2}>Regístrate y comienza la aventura</Text>
            </View>
            <TextInput value={email} autoCapitalize={"none"} onChangeText={setEmail} style={styles.textInput}
                       textContentType={"emailAddress"}
                       placeholder={"correo electrónico"}/>
            <TextInput value={password} onChangeText={setPassword} autoCapitalize={"none"} secureTextEntry={true}
                       textContentType={"password"} style={styles.textInput}
                       placeholder={"contraseña"}/>
            <TextInput value={repeatPassword} onChangeText={setRepeatPassword} autoCapitalize={"none"}
                       secureTextEntry={true} textContentType={"password"}
                       style={styles.textInput} placeholder={"repite contraseña"}/>
            <CustomBlueButton title={"Registrarse"} onPress={handleRegister}/>
            <Text style={styles.normalText}>¿Ya tiene cuenta?</Text>
            <Pressable onPress={() => {
                navigation.navigate("Login")
            }}>
                <Text style={styles.buttonText}>Inicia sesión</Text>
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
        color: "#52E23E",
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
        fontSize: 20,

    },
    buttonText: {
        fontFamily: "OpenSans-Regular",
        fontStyle: "normal",
        fontSize: 20,
        color: "#52E23E"
    },
    textInput: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: "#00DAE8",
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