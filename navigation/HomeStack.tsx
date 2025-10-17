import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/Home/HomeScreen";
import {BottomBar} from "../component/nav/BottomBar";
import NoticeScreen from "../screens/Home/NoticeScreen";
import BMCScreen from "../screens/Home/BMCScreen";
import {Easing, ImageBackground, StyleSheet, View} from 'react-native';
import HeaderBar from '../component/HeaderBar';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CalendarScreen from '../screens/Home/Calendar/CalendarScreen';



export type HomeStackParamList = {
    Home : undefined,
    Notice : {
        supportField ?: string
    },
    Calendar : undefined,
    BMC : undefined
}

const Tab = createBottomTabNavigator<HomeStackParamList>();

export function HomeStack({ navigation }: any) {
    const insets = useSafeAreaInsets();
    return (
        <ImageBackground source={require("../assets/images/glass-background.png")} style={[styles.container, { paddingTop: insets.top}]}>
            <Tab.Navigator
                tabBar={(props) => <BottomBar {...props} />}
                screenOptions={{
                    header : () => (<HeaderBar
                        onClickMenu={() => navigation.navigate('SystemStack')}
                    />),
                    animation : 'shift',
                    transitionSpec : {
                        animation : 'timing',
                        config : {
                            duration : 90,
                            easing : Easing.inOut(Easing.ease)
                        }
                    },
                    sceneStyle : {
                        backgroundColor : 'transparent',
                        overflow : "visible"
                    }
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen}/>
                <Tab.Screen name="Notice" component={NoticeScreen}/>
                <Tab.Screen name="Calendar" component={CalendarScreen}/>
                <Tab.Screen name="BMC" component={BMCScreen}/>
            </Tab.Navigator>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})