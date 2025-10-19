import { createStackNavigator } from "@react-navigation/stack";
// import SystemScreen from "../screens/system/SystemScreen";
import ProfileScreen from "../screens/system/ProfileScreen";
import { Colors } from "../constants/Color";
import { GetMeResponse } from "../type/user/user.type";
import EditProfileScreen from "../screens/system/EditProfileScreen";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {View} from "react-native";

const Stack = createStackNavigator<SystemStackParamList>();

export type SystemStackParamList = {
    Profile : undefined,
    EditProfile : GetMeResponse["data"]
};

export default function SystemStack(){
    const insets = useSafeAreaInsets();
    return (
        <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
            <Stack.Navigator
                initialRouteName={"Profile"}
                screenOptions={{
                    cardStyle : {
                        backgroundColor : Colors.white1
                    },
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Profile" component={ProfileScreen}/>
                <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
            </Stack.Navigator>
        </View>
    )
}