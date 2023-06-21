import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

export default function PlantPage({route}) {
    const{plant, photo} = route.params


    return(
        <ScrollView alwaysBounceVertical={false} style={styles.scrollContainer}>
        <View style={styles.container}>

            <Text style={styles.colloquialName}>{plant.colloquialName}</Text>
            <Text style={[styles.normalText, {marginBottom: hp(2)}]}>{plant.scientificName}</Text>
            <Image style={styles.plantImage} source={{uri : photo}}/>


            <Text style={[styles.normalText, {color: "#52E23E"}]}>{plant.type}</Text>
            <Text style={[styles.normalText, {marginBottom: hp(2)}]}>{plant.origin}</Text>
            <Text style={[styles.normalText, {textAlign: "justify"}]}>{plant.description}</Text>

        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    container: {
        marginTop: hp(10),
        flex: 1,
        display: "flex",
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantImage:{
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
        borderWidth: 2,
        borderColor: '#52E23E',
        marginBottom: hp(1)
    },
    colloquialName: {
        fontFamily: "Roboto-Regular",
        fontSize: 30,
        color: "#00DAE8"
    },
    normalText:{
        display: "flex",
        alignSelf: "center",
        marginLeft: wp(5),
        marginRight: wp(5),
        fontFamily: "Roboto-Regular",
        fontSize: 20,
    }
})