import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/Home/HomeScreen";
import {BottomBar} from "../component/nav/BottomBar";
import NoticeScreen from "../screens/Home/NoticeScreen";
import BMCScreen from "../screens/Home/BMCScreen";
import { Colors } from '../constants/Color';
import {Easing, StyleSheet, View} from 'react-native';
import HeaderBar from '../component/HeaderBar';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CalendarScreen from '../screens/Home/Calendar/CalendarScreen';

const Tab = createBottomTabNavigator();

export type HomeStackParamList = {
    Home : undefined,
    Notice : {
        supportField ?: string
    },
    Calendar : undefined,
    BMC : undefined
}

export function HomeStack({ navigation }: any) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top}]}>
            <Tab.Navigator
                tabBar={(props) => <BottomBar {...props} />}
                screenOptions={{
                    header : () => (<HeaderBar
                        onClickBellIcon={() => {}}
                        onClickSystemIcon={() => navigation.navigate('SystemStack')}
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
                        backgroundColor : Colors.white1,
                        overflow : "visible"
                    }
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen}/>
                <Tab.Screen name="Notice" component={NoticeScreen}/>
                <Tab.Screen name="Calendar" component={CalendarScreen}/>
                <Tab.Screen name="BMC" component={BMCScreen}/>
            </Tab.Navigator>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})