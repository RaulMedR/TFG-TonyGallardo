import {StyleSheet, Text, TouchableOpacity} from "react-native";

export default function CustomBlueButton({title, onPress}){

    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#00DAE8",
        borderRadius: 15,
        width: 225,
        height: 60,
        justifyContent: "center",
    },
    text: {
        color: "#000000",
        textAlign: "center",
        fontFamily: "Lato-Regular",
        fontSize: 24.42,
    }
})