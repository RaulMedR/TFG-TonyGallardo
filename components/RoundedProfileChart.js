import {StyleSheet, Text, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

export default function RoundedProfileChart() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plantas</Text>
            <View style={styles.textContainer}>
                <Text style={styles.textNumber}>14</Text>
                <Text style={styles.textNumber}>/</Text>
                <Text style={styles.textNumber}>55</Text>
            </View>

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        width: wp(70),
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        height: wp(85) * 0.3,
        borderRadius: 25,
        borderColor: "#52E23E",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: hp(4)
    },
    title: {
        fontFamily: "OpenSans-Regular",
        fontSize: 20,

    },
    textContainer: {
        display: "flex",
        flexDirection: "row",
    },

    textNumber: {
        fontSize: 23,
        fontFamily: "OpenSans-Regular",
        color: "#52E23E"
    }

})