import { StyleSheet, Text } from "react-native";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";
import ReanimatedPressable from "./ReanimatedPressable";

type CommonButtonProps = {
    title : string,
    onPress : () => void,
    disabled : boolean,
}

export default function CommonButton(props : CommonButtonProps) {
    return(
        <ReanimatedPressable
            style={styles.container}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            <Text style={styles.text}>{props.title}</Text>
        </ReanimatedPressable>
    )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor : Colors.primary,
        borderRadius : 10,
        alignItems : "center",
        justifyContent : "center",
        paddingVertical : 18
    },
    text : {
        color : Colors.white1,
        fontSize : 16,
        fontFamily : Fonts.medium,
    }
})
