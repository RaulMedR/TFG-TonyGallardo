import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {useContext, useState} from "react";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import * as ImagePicker from 'expo-image-picker';
import CustomButton from "../components/CustomButton";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text";
import PlantContext from "../context/PlantContext";
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {auth, storage} from "../utils/firebaseConfig";
import {updateProfile} from 'firebase/auth'


export default function EditProfilePage({navigation}) {
    const {user, setUser} = useContext(PlantContext)
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [loading, setLoading] = useState(false)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    }

    const handleSaveEditProfile = async () => {
        setLoading(true)
        if (profilePic && name) {
            const response = await fetch(profilePic)
            const blob = await response.blob()
            const storageRef = ref(storage, 'users/' + user.uid + '.jpg')
            await uploadBytes(storageRef, blob).catch((error) => {
                alert("Ha habido un error en la subida: " + error.toString())
            })
            await getDownloadURL(storageRef).then(async (downloadURL) => {
                const updateData = {
                    displayName: name,
                    photoURL: downloadURL
                }
                await updateProfile(auth.currentUser, updateData)
                setUser(auth.currentUser)

            })

        } else if (name) {
            const updateData = {
                displayName: name
            }
            await updateProfile(auth.currentUser, updateData)
            setUser(auth.currentUser)
        } else if (profilePic) {

            const response = await fetch(profilePic)
            const blob = await response.blob()
            const storageRef = ref(storage, 'users/' + user.uid + '.jpg')
            await uploadBytes(storageRef, blob).catch((error) => {
                alert("Ha habido un error en la subida: " + error.toString())
            })
            await getDownloadURL(storageRef).then(async (downloadURL) => {
                const updateData = {
                    photoURL: downloadURL
                }
                await updateProfile(auth.currentUser, updateData)
                setUser(auth.currentUser)

            })
        }
        setLoading(false)
        navigation.navigate("ProfilePage")


    }
    return (

        <ScrollView alwaysBounceVertical={false} style={styles.scrollContainer}>
            <View style={styles.container}>
                <AutoSizeText style={styles.textButton}
                              minimumFontScale={16}
                              numberOfLines={2}
                              mode={ResizeTextMode.min_font_size}>Pulsa en la imagen y selecciona una nueva foto de
                    perfil</AutoSizeText>
                <Pressable onPress={pickImage}>
                    <Image source={profilePic ? {uri: profilePic} : require("../assets/images/logo-app.png")}
                           style={styles.image}/>
                </Pressable>
                <TextInput
                    style={styles.textInput}
                    placeholder={user.displayName ? user.displayName : "Nombre"}
                    value={name}
                    onChangeText={setName}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#00DAE8"
                                       style={{alignSelf: "center"}}/>) : (
                    <CustomButton color={"#00DAE8"} title="Guardar" onPress={handleSaveEditProfile}/>

                )}
            </View>
        </ScrollView>
    )


}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',

    },
    container: {
        height: hp(100),
        backgroundColor: "#FFFFFF",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: "#00DAE8",
        backgroundColor: "#F8F8F8",
        width: wp(70),
        height: wp(85) * 0.2,
        paddingLeft: 22,
        paddingRight: 22,
        fontStyle: "normal",
        fontFamily: "OpenSans-Regular",
        fontSize: 20,
        marginBottom: hp(3),
    },
    textButton: {
        color: "#000000",
        padding: wp(2),
        fontSize: 16,
        marginBottom: hp(2),
        width: wp(70),
        textAlign: "center"
    },
    image: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
        borderWidth: 2,
        borderColor: '#00DAE8',
        marginBottom: hp(2),
    },
    additionalInfo: {
        height: hp(40),
        width: wp(85),
        justifyContent: "center",
        alignItems: "center",
        margin: wp(4),
        borderColor: '#52E23E',
        borderRadius: 20,
        borderWidth: 1,
    },
})