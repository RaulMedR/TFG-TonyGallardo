import {NavigationContainer} from "@react-navigation/native";
import HomePage from "./screens/HomePage";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";


const Stack = createNativeStackNavigator();
export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Home"} screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name={"Home"}
                    component={HomePage}
                />
                <Stack.Screen
                    name={"Login"}
                    component={LoginPage}
                />
                <Stack.Screen
                    name={"Register"}
                    component={RegisterPage}
                />
            </Stack.Navigator>
        </NavigationContainer>


    );
}

