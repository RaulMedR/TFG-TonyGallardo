import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MainPage from "../screens/MainPage";
import ProfilePage from "../screens/ProfilePage";


const Tab = createBottomTabNavigator()
export default function BottomTabNavigator() {
    return (
        <Tab.Navigator screenOptions={() => ({
            headerShown: false,
            tabBarActiveTintColor: 'red',
        })}>
            <Tab.Screen name="MainPage" component={MainPage}/>
            <Tab.Screen name="Profile" component={ProfilePage}/>


        </Tab.Navigator>
    )

}