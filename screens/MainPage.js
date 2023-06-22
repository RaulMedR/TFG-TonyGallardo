import {BackHandler, Text, View} from "react-native";
import {useEffect} from "react";

export default function MainPage() {
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp(); // Cierra la aplicación
            return true; // Evita el comportamiento predeterminado del botón "Atrás"
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove(); // Limpia el listener al desmontar el componente
    }, []);


    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Main Page Works</Text>
        </View>

    )
}