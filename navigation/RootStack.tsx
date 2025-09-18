import {createStackNavigator} from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import {HomeStack} from "./HomeStack";
import { Colors } from "../constants/Color";
import InChatScreen from "../screens/Home/chat/InChatScreen";
import { ChatMessage } from "../type/chat/messages.type";
import SystemStack from "./SystemStack";
import InMatchScreen from "../screens/Home/match/InMatchScreen";
import InBMCScreen from "../screens/Home/BMC/InBMCScreen";
import {BMCType} from "../type/BMC/BMC.type";
import InNoticeScreen from "../screens/Home/notice/InNoticeScreen";
import {NoticeType} from "../type/notice/notice.type";

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    AuthStack: undefined;
    HomeStack: undefined;
    InChat : {
        roomId : number
        chatLst : ChatMessage[]
        name : string
        companyName : string
        img : string
    },
    SystemStack : undefined,
    InMatch : {
        matchId : number
    },
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
            <Stack.Screen name="InChat" component={InChatScreen}/>
            <Stack.Screen name="SystemStack" component={SystemStack}/>
            <Stack.Screen name="InMatch" component={InMatchScreen}/>
            <Stack.Screen name="InBMC" component={InBMCScreen}/>
            <Stack.Screen name="InNotice" component={InNoticeScreen}/>
        </Stack.Navigator>
    )
};
