import {ActivityIndicator, Image, Pressable, StyleSheet, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text";
import {useState} from "react";

export default function CustomCard({plant, color, cardStyle, navigation, destination}) {
    const [loadingImage, setLoadingImage] = useState(true);


    return (
        <Pressable onPress={() => {
            navigation.navigate(destination, {plant: plant})

        }}>
            <View style={[styles.container, cardStyle]}>
                <View style={[styles.cardContainer, {borderColor: color}]}>
                    <View style={styles.imageContainer}>

                        <Image source={plant.image ? {uri: plant.image} : require("../assets/images/logo-app.png")}
                               style={styles.plantImage} onLoadStart={() => setLoadingImage(true)}
                               onLoadEnd={() => setLoadingImage(false)}/>
                        {loadingImage && (
                            <ActivityIndicator size="small" color="#00DAE8"
                                               style={{position: "absolute", alignSelf: "center"}}/>)}
                    </View>

                    <View style={styles.textContainer}>
                        <AutoSizeText style={styles.plantName}
                                      fontSizePresets={[20, 30, 40]}
                                      numberOfLines={2}
                                      mode={ResizeTextMode.preset_font_sizes}>{plant.colloquialName}</AutoSizeText>
                    </View>

                </View>
            </View>
        </Pressable>
    )


}


const styles = StyleSheet.create({
    container: {
        width: wp(80),
        display: "flex",
        alignItems: "center",
        marginBottom: hp(4)
    },
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        width: wp(70),
        height: wp(70) * 0.30,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 5,
    },
    imageContainer: {
        width: wp(20),
        display: "flex",
        alignItems: "center",
        justifyContent: "center"

    },
    plantImage: {
        marginTop: wp(0.5),
        marginLeft: wp(0.5),
        width: wp(18),
        height: wp(18),
        borderRadius: wp(9),
    },
    textContainer: {
        width: wp(45),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    plantName: {
        marginLeft: wp(2),
        fontFamily: "OpenSans-Regular",
    },
})