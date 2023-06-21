import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MainPage from "../screens/MainPage";
import ProfilePage from "../screens/ProfilePage";
import {PlantProvider} from "./PlantContext";
import PlantsDirectoryPage from "../screens/PlantsDirectoryPage";


const Tab = createBottomTabNavigator()
export default function BottomTabNavigator() {
    return (
        <PlantProvider>

            <Tab.Navigator screenOptions={() => ({
                headerShown: false,
                tabBarActiveTintColor: 'red',
            })}>
                <Tab.Screen name="MainPage" component={MainPage}/>
                <Tab.Screen name="PlantDirectory" component={PlantsDirectoryPage}/>
                <Tab.Screen name="Profile" component={ProfilePage}/>


            </Tab.Navigator>
        </PlantProvider>
    )

}