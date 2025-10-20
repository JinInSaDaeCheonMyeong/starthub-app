import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";

type LinkActionTextProps = {
    title : string,
    onPress : () => void
}

export default function LinkActionText(props : LinkActionTextProps) {
    return ( 
        <TouchableOpacity onPress={props.onPress} hitSlop={8}>
            <Text style={styles.linkActionText}>
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    linkActionText : {
        color : Colors.gray2,
        fontSize : 14,
        fontFamily : Fonts.reqular,
    }
})