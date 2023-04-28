import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import CustomGreenButton from "../components/CustomGreenButton";

export default function LoginPage({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.titlesView}>
                <Text style={styles.title1}>¡Te echábamos de menos!</Text>
                <Text style={styles.title2}>¡Vamos a seguir explorando juntos!</Text>

            </View>
            <TextInput style={styles.textInput} placeholder={"correo electrónico"}/>
            <TextInput style={styles.textInput} placeholder={"contraseña"}/>
            <CustomGreenButton title={"Iniciar sesión"} onPress={() => {
                navigation.navigate("Home")
            }}/>
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
        marginBottom: 100
    },
    title1: {
        fontFamily: "Lobster-Regular",
        color: "#00DAE8",
        fontSize: 36,
        marginBottom: 28,
        textAlign: "center"
    },
    title2: {
        fontFamily: "Roboto-Bold",
        fontSize: 36,
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
        width: 354,
        height: 67,
        paddingLeft: 22,
        fontStyle: "normal",
        fontFamily: "OpenSans-Regular",
        fontSize: 20,
        marginBottom: 38,
    }
});