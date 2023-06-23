import {Image, StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text";

export default function CustomNewsCard({news}) {
    return (

        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={news.photo ? {uri: news.photo} : require("../assets/images/logo-app.png")}
                           style={styles.newsImage}/>
                </View>

                <View style={styles.textContainer}>
                    <AutoSizeText style={styles.newsTitle}
                                  fontSizePresets={[20, 30, 40]}
                                  numberOfLines={1}
                                  mode={ResizeTextMode.preset_font_sizes}>{news.title}</AutoSizeText>
                    <Text style={styles.newsText} adjustsFontSizeToFit={true}>{news.description}</Text>

                </View>


            </View>

        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(2),
    },
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#00DAE8",
        width: wp(80),
        height: wp(80) * 0.40,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 4,
    },
    imageContainer: {
        width: wp(20),
        display: "flex",
        alignItems: "center",
        justifyContent: "center"

    },
    newsImage: {
        marginTop: wp(0.5),
        marginLeft: wp(0.5),
        width: wp(18),
        height: wp(18),
        borderRadius: wp(3),
    },
    textContainer: {
        marginTop: hp(1),
        width: wp(55),
        alignItems: "center"
    },
    newsTitle: {
        marginLeft: wp(2),
        fontFamily: "OpenSans-Regular",
        marginBottom: hp(0.5),
    },
    newsText: {
        marginLeft: wp(2),
        fontFamily: "OpenSans-Regular",
        height: hp(10),
    }
})