import {StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {useContext} from "react";
import PlantContext from "../context/PlantContext";

export default function RoundedProfileChart() {
    const {scannedPlants, totalPlants} = useContext(PlantContext)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plantas</Text>
            <View style={styles.textContainer}>
                <Text style={styles.textNumber}>{scannedPlants.toString()}</Text>
                <Text style={styles.textNumber}>/</Text>
                <Text style={styles.textNumber}>{totalPlants.toString()}</Text>
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