import {createStackNavigator} from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import {HomeStack} from "./HomeStack";
import { Colors } from "../constants/Color";
import SystemStack from "./SystemStack";
import InBMCScreen from "../screens/Home/BMC/InBMCScreen";
import {BMCType} from "../type/BMC/BMC.type";
import InNoticeScreen from "../screens/Home/notice/InNoticeScreen";
import {NoticeType} from "../type/notice/notice.type";

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    AuthStack: undefined;
    HomeStack: undefined;
    SystemStack : undefined,
    InBMC : {
        BMC: BMCType
    },
    InNotice : {
        Notice : NoticeType
        onGoBack?: (noticeId: number, isLiked: boolean) => void;
    }
};

export default function RootStack() {
    return (
        <Stack.Navigator 
            initialRouteName={"AuthStack"} 
            screenOptions={{
                cardStyle : {
                    backgroundColor : Colors.white1
                },
                headerShown: false
            }}
        >
            <Stack.Screen name="AuthStack" component={AuthStack} />
            <Stack.Screen name="HomeStack" component={HomeStack} />
            <Stack.Screen name="SystemStack" component={SystemStack}/>
            <Stack.Screen name="InBMC" component={InBMCScreen}/>
            <Stack.Screen name="InNotice" component={InNoticeScreen}/>
        </Stack.Navigator>
    )
};
