import { View } from "react-native";
import { ToastType } from "../util/ShowToast";
import { Text } from "react-native";
import ErrorIcon from "../assets/icons/toast/error.svg"
import SuccessIcon from "../assets/icons/toast/success.svg";
import WarningIcon from "../assets/icons/toast/warning.svg";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";

type CustomToastType = {
    text : string
    type : ToastType
}

export default function CustomToast(props : CustomToastType) {
    const getIcon = () => {
        switch (props.type) {
            case ToastType.ERROR:
                return <ErrorIcon width={20} height={20}/>;
            case ToastType.SUCCESS:
                return <SuccessIcon width={20} height={20}/>;
            case ToastType.WARNING:
                return <WarningIcon width={20} height={20}/>;
            default:
                return null;
        }
    };
    return (
        <View style={{
            flexDirection : 'row', 
            gap : 10, 
            borderRadius : 35, 
            paddingVertical : 12,
            paddingHorizontal : 16,
            backgroundColor : Colors.gray1,
            alignItems : 'center'
        }}>
            {getIcon()}
            <Text style={{
                color : Colors.white1,
                fontFamily : Fonts.medium,
                fontSize : 14
            }}>
                {props.text}
            </Text>
        </View>
    )
}