import {NavigationContainer} from "@react-navigation/native";
import HomePage from "./screens/HomePage";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import {RootSiblingParent} from 'react-native-root-siblings'
import BottomTabNavigator from "./components/BottomTabNavigator";

const Stack = createNativeStackNavigator();
export default function App() {

    return (
        <RootSiblingParent>

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
                    <Stack.Screen
                        name={"Main"} component={BottomTabNavigator}/>
                </Stack.Navigator>
            </NavigationContainer>
        </RootSiblingParent>
    );
}

