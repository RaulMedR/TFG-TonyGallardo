import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MainPage from "../screens/MainPage";
import ProfilePage from "../screens/ProfilePage";
import {PlantProvider} from "./PlantContext";
import PlantsDirectoryPage from "../screens/PlantsDirectoryPage";
import PlantPage from "../screens/PlantPage";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import QrScanPage from "../screens/QrScanPage";
import NewsPage from "../screens/NewsPage";
import EditProfilePage from "../screens/EditProfilePage";
import MapPage from "../screens/MapPage";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";


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

const ProfileStack = createNativeStackNavigator();

function ProfileStackNavigator() {
    return (
        <ProfileStack.Navigator screenOptions={() => ({
            headerShown: false,
        })}>
            <ProfileStack.Screen name="ProfilePage" component={ProfilePage}/>
            <ProfileStack.Screen name="EditProfile" component={EditProfilePage}/>
        </ProfileStack.Navigator>
    )
}

const MainStack = createNativeStackNavigator();
function MainStackNavigator(){
    return (
        <MainStack.Navigator screenOptions={() => ({
            headerShown: false,
        })}>
            <MainStack.Screen name="MainLoggedPage" component={MainPage}/>
            <MainStack.Screen name="PlantDetailPage" component={PlantPage}/>
            <MainStack.Screen name="QrScanPage" component={QrScanPage}/>

        </MainStack.Navigator>
    )
}
const MapStack = createNativeStackNavigator()

function MapStackNavigator() {
    return (
        <MapStack.Navigator screenOptions={() => ({
            headerShown: false,
        })}>
            <MapStack.Screen name="MapPage" component={MapPage}/>
            <MapStack.Screen name="QrScanFromMap" component={QrScanPage}/>
            <MapStack.Screen name="PlantDetailFromMap" component={PlantPage}/>

        </MapStack.Navigator>
    )
}

const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        style={styles.mapTabStyle}
        onPress={onPress}
    >

        <View style={styles.mapTabStyleView}>
            {children}
        </View>

    </TouchableOpacity>

)

export default function BottomTabNavigator() {
    return (
        <PlantProvider>

            <Tab.Navigator screenOptions={() => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingHorizontal: wp(3),
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: "#FFFFFF",
                    height: hp(8),
                    paddingBottom: hp(3),


                }
            })}>
                <Tab.Screen name="MainPage" component={MainStackNavigator} options={{
                    tabBarIcon: ({focused}) => (
                        <View style={styles.normalView}>
                            <Image source={require("../assets/images/home-icon.png")} resizeMode={"contain"}
                                   style={[styles.normalImage, {
                                       tintColor: focused ? "#52E23E" : "#00DAE8"
                                   }]
                                   }/>
                        </View>
                    )
                }
                }/>
                <Tab.Screen name="PlantDirectory" component={PlantStackNavigator} options={{
                    tabBarIcon: ({focused}) => (
                        <View style={styles.normalView}>
                            <Image source={require("../assets/images/leaf-icon.png")} resizeMode={"contain"}
                                   style={[styles.normalImage, {
                                       tintColor: focused ? "#52E23E" : "#00DAE8"
                                   }]
                                   }/>
                        </View>
                    )
                }
                }/>
                <Tab.Screen name="Map" component={MapStackNavigator} options={{
                    tabBarIcon: ({focused}) => (
                        <Image source={require("../assets/images/map-icon.png")} resizeMode={"contain"}
                               style={[styles.mapTabImage, {
                                   tintColor: focused ? "#52E23E" : "#00DAE8"
                               }]
                               }/>
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    )

                }
                }/>
                <Tab.Screen name="News" component={NewsPage} options={{
                    tabBarIcon: ({focused}) => (
                        <View style={styles.normalView}>
                            <Image source={require("../assets/images/news-icon.png")} resizeMode={"contain"}
                                   style={[styles.normalImage, {
                                       tintColor: focused ? "#52E23E" : "#00DAE8"
                                   }]
                                   }/>
                        </View>
                    )
                }
                }/>
                <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{
                    tabBarIcon: ({focused}) => (
                        <View style={styles.normalView}>
                            <Image source={require("../assets/images/profile-icon.png")} resizeMode={"contain"}
                                   style={[styles.normalImage, {
                                       tintColor: focused ? "#52E23E" : "#00DAE8"
                                   }]
                                   }/>
                        </View>
                    )
                }
                }/>


            </Tab.Navigator>
        </PlantProvider>
    )

}

const styles = StyleSheet.create({
    normalView: {
        top: hp(1.5)
    },
    normalImage: {
        width: wp(10),
        height: wp(10)
    },
    mapTabStyle: {
        top: -hp(2),
    },
    mapTabStyleView: {
        backgroundColor: "#FFFFFF",
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        borderWidth: 0.5,
        borderColor: "#C7C7C7"
    },
    mapTabImage: {
        width: wp(16),
        height: wp(16),
    }

})