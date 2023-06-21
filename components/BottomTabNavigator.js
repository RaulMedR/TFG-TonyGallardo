import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MainPage from "../screens/MainPage";
import ProfilePage from "../screens/ProfilePage";
import {PlantProvider} from "./PlantContext";
import PlantsDirectoryPage from "../screens/PlantsDirectoryPage";
import PlantPage from "../screens/PlantPage";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import QrScanPage from "../screens/QrScanPage";


const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator();

function PlantStackNavigator() {
    return (
        <Stack.Navigator screenOptions={() => ({
            headerShown: false,
        })}>
            <Stack.Screen name="PlantsDirectoryPage" component={PlantsDirectoryPage}/>
            <Stack.Screen name="PlantDetail" component={PlantPage}/>
            <Stack.Screen name="QrScan" component={QrScanPage}/>
        </Stack.Navigator>
    );
}

export default function BottomTabNavigator() {
    return (
        <PlantProvider>

            <Tab.Navigator screenOptions={() => ({
                headerShown: false,
                tabBarActiveTintColor: 'red',
            })}>
                <Tab.Screen name="MainPage" component={MainPage}/>
                <Tab.Screen name="PlantDirectory" component={PlantStackNavigator}/>
                <Tab.Screen name="Profile" component={ProfilePage}/>


            </Tab.Navigator>
        </PlantProvider>
    )

}