import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectScreen from "../screens/competitor/SelectScreen";
import ResultScreen from "../screens/competitor/ResultScreen";

const Stack = createStackNavigator<CompoetitorStackParamList>()

export type CompoetitorStackParamList = {
    Select : undefined;
    Result : undefined;
};

export default function CompetitorStack() {
    const insets = useSafeAreaInsets();
    return (
        <View style={[{flex : 1, paddingTop : insets.top, paddingBottom : insets.bottom}]}>
            <Stack.Navigator
                initialRouteName={"Select"}
                screenOptions={{
                    headerShown: false,
            }}>
                <Stack.Screen name="Select" component={SelectScreen}/>
                <Stack.Screen name="Result" component={ResultScreen}/>
            </Stack.Navigator>
        </View>
    )
}