import {Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import RoundedProfileChart from "../components/RoundedProfileChart";
import {useContext, useState} from "react";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import CustomButton from "../components/CustomButton";
import {onAuthStateChanged} from "firebase/auth";
import {addDoc, collection} from "firebase/firestore"
import {auth, db} from "../utils/firebaseConfig";
import PlantContext from "../components/PlantContext";

export default function ProfilePage() {
    const {user, setUser} = useContext(PlantContext)
    const [userName, setUserName] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    const [suggestion, setSuggestion] = useState('')

    onAuthStateChanged(auth, (user) => {
        setUser(user)
        if (user.displayName != null) {
            setUserName(user.displayName)
        } else {
            setUserName("Nombre")
        }
        if (user.photoURL != null) {
            setUserPhoto(user.photoURL)
        }
    })

    const handleSuggestion = async () => {
        await addDoc(collection(db, "suggestions"), {
            uid: user.uid,
            message: suggestion.trim()
        })
        setSuggestion('')
    }
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={userPhoto ? userPhoto : require("../assets/images/logo-app.png")}
                    style={styles.profileImage}
                />

                <Text style={styles.nameText}>{userName}</Text>
            </View>
            <RoundedProfileChart/>

            <TextInput value={suggestion} onChangeText={setSuggestion} style={styles.textInput}
                       placeholder={"Escribe una sugerencia o queja..."} multiline={true} textAlignVertical={"top"}/>
            <CustomButton title={"Enviar"} onPress={handleSuggestion} color={"#00DAE8"}/>
            <Pressable onPress={() => {
            }}>
                <Text style={styles.buttonText}>Editar perfil</Text>
            </Pressable>


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        marginTop: hp(2),
        alignItems: 'center',
        marginBottom: hp(3)
    },
    profileImage: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
        borderWidth: 2,
        borderColor: '#00DAE8',
    },
    textInput: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: "#00DAE8",
        backgroundColor: "#F8F8F8",
        width: wp(85),
        height: wp(85) * 0.4,
        paddingTop: hp(1),
        paddingLeft: 22,
        paddingRight: 22,
        fontStyle: "normal",
        fontFamily: "OpenSans-Regular",
        fontSize: 20,
        marginBottom: hp(3),
    },
    buttonText: {
        fontFamily: "OpenSans-Regular",
        fontStyle: "normal",
        marginTop: hp(1),
        fontSize: 20,
        color: "#52E23E"
    },
    nameText: {
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        color: "#A8A8A8",
    }
})