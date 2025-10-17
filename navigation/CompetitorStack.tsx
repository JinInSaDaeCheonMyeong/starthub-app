import { createStackNavigator } from "@react-navigation/stack";
import { ImageBackground, ImageSourcePropType, ImageURISource, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectScreen from "../screens/competitor/SelectScreen";
import ResultScreen from "../screens/competitor/ResultScreen";
import { CompetitorResponse } from "../type/competitor/competitor.type";
import { HistoryScreen } from "../screens/competitor/HistoryScreen";

const Stack = createStackNavigator<CompoetitorStackParamList>()

export type CompoetitorStackParamList = {
    History : undefined;
    Select : undefined;
    Result : {image : ImageURISource, bmcId : number, data : CompetitorResponse['data']};
};

export default function CompetitorStack() {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[{
                flex : 1, 
                marginTop : insets.top, 
                paddingBottom : insets.bottom
            }]}
        >
            <Stack.Navigator
                initialRouteName={"History"}
                screenOptions={{
                    headerShown: false,
                    cardStyle : {
                        backgroundColor : 'transparent'
                    }
            }}>
                <Stack.Screen name="History" component={HistoryScreen}/>
                <Stack.Screen name="Select" component={SelectScreen}/>
                <Stack.Screen name="Result" component={ResultScreen}/>
            </Stack.Navigator>
        </View>
    )
}