import {StyleSheet, Text, TouchableOpacity} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function CustomBlueButton({title, onPress}){

    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: hp(1),
        marginBottom: hp(1),
        backgroundColor: "#00DAE8",
        borderRadius: 15,
        width: wp(50),
        height: wp(50) * 0.25,
        justifyContent: "center",
    },
    text: {
        color: "#000000",
        textAlign: "center",
        fontFamily: "Lato-Regular",
        fontSize: 20,
    }
})