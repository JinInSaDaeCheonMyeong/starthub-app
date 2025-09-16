import {createStackNavigator} from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import SigninScreen from "../screens/SigninScreen";
import { Colors } from "../constants/Color";
import StartScreen from "../screens/StartScreen";
import SignupScreen from "../screens/SignupScreen";
import SignupInputScreen from "../screens/SignupInputScreen";
import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CompanyInputScreen from "../screens/CompanyInputScreen";
import StartupStatus from "../constants/StartupStatus";

const Stack = createStackNavigator<AuthStackParamList>()

export type AuthStackParamList = {
    Welcome: undefined;
    Signin : undefined;
    Signup : undefined;
    Start : undefined;
    SignupInput : undefined;
    CompanyInput : {
        username : string
        birth : string
        gender : string
        startupType : StartupStatus
    };
};

export default function AuthStack() {
    const insets = useSafeAreaInsets();
    return (
        <View style= {{paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1}}>
            <Stack.Navigator
                initialRouteName={"Welcome"}
                screenOptions={{
                    cardStyle : {
                        backgroundColor : Colors.white1,
                    },
                    headerShown: false
                }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Signin" component={SigninScreen} />
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="SignupInput" component={SignupInputScreen} />
                <Stack.Screen name="CompanyInput" component={CompanyInputScreen} />
            </Stack.Navigator>
        </View>
    )
};