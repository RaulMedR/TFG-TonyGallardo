import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../utils/firebaseConfig";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import CustomNewsCard from "../components/CustomNewsCard";

export default function NewsPage() {
    const [newsData, setNewsData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (newsData.length === 0) {
            getDocs(collection(db, "news")).then((docs) => {
                const newsData = [];
                docs.forEach((doc) => {
                    newsData.push({id: doc.id, ...doc.data()});
                });
                newsData.sort((a, b) => b.id - a.id);
                setNewsData(newsData);
                setLoading(false)
            })
        }

    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>¡Lee y</Text>
                <Text style={styles.titleText}>descubre!</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00DAE8" style={{position: "absolute", alignSelf: "center"}}/>

                </View>
            ) : (
                <ScrollView alwaysBounceVertical={false}>
                    {newsData.map((news, index) => (
                        <CustomNewsCard key={index} news={news}/>
                    ))}
                </ScrollView>
            )}
        </View>
    )


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    titleContainer: {
        paddingTop: hp(5),
        paddingLeft: wp(3),
        paddingBottom: hp(2),

    },
    titleText: {
        fontSize: 40,
        fontFamily: "Roboto-Regular",
        color: "#A8A8A8"

    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }

})