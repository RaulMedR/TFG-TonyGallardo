import {Image, ScrollView, StyleSheet, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text";

export default function CustomNewsCard({news}){
    return(

        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} alwaysBounceVertical={false}>

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
                    <AutoSizeText style={styles.newsText}
                                  fontSizePresets={[12, 16, 20]}
                                  numberOfLines={3}
                                  mode={ResizeTextMode.preset_font_sizes}>{news.description}</AutoSizeText>

                </View>

            </View>

            </ScrollView>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(4)
    },
    scrollContainer: {
        padding: wp(2)
    },
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#00DAE8",
        width: wp(80),
        height: wp(80) * 0.30,
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
    newsImage: {
        marginTop: wp(0.5),
        marginLeft: wp(0.5),
        width: wp(18),
        height: wp(18),
        borderRadius: wp(3),
    },
    textContainer: {
        width: wp(55),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    newsTitle: {
        marginLeft: wp(2),
        fontFamily: "OpenSans-Regular",
        marginBottom: hp(1),
    },
    newsText: {
        marginLeft: wp(2),
        fontFamily: "OpenSans-Regular",
        textAlign: "justify"
    }
})