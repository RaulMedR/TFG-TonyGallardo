import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export default function CustomGreenButton({title, onPress}){

    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#52E23E",
        marginTop: hp(1),
        marginBottom: hp(1),
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