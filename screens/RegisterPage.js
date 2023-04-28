import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import CustomBlueButton from "../components/CustomBlueButton";

export default function RegisterPage({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.titlesView}>
                <Text style={styles.title1}>¡Bienvenido a Tony Gallardo!</Text>
                <Text style={styles.title2}>Regístrate y comienza la aventura</Text>
            </View>
            <TextInput style={styles.textInput} placeholder={"correo electrónico"}/>
            <TextInput style={styles.textInput} placeholder={"contraseña"}/>
            <TextInput style={styles.textInput} placeholder={"repite contraseña"}/>
            <CustomBlueButton title={"Registrarse"} onPress={() => {
                navigation.navigate("Home")
            }}/>
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
        marginBottom: 80
    },
    title1: {
        fontFamily: "Lobster-Regular",
        color: "#52E23E",
        fontSize: 33,
        marginBottom: 28,
        textAlign: "center"
    },
    title2: {
        fontFamily: "Roboto-Bold",
        fontSize: 35,
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
        color: "#52E23E"
    },
    textInput: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: "#00DAE8",
        backgroundColor: "#F8F8F8",
        width: 354,
        height: 67,
        paddingLeft: 22,
        fontStyle: "normal",
        fontFamily: "OpenSans-Regular",
        fontSize: 20,
        marginBottom: 38,
    }
});