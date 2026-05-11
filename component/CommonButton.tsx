import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";
import ReanimatedPressable from "./ReanimatedPressable";

type CommonButtonProps = {
    title : string,
    onPress : () => void,
    disabled ?: boolean,
    leftIcon ?: React.ReactNode,
    keepTextCentered ?: boolean,
    containerStyle ?: StyleProp<ViewStyle>,
    textStyle ?: StyleProp<TextStyle>,
}

export default function CommonButton(props : CommonButtonProps) {
    return(
        <ReanimatedPressable
            style={[styles.container, props.containerStyle]}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            {props.keepTextCentered && (
                <View style={styles.iconSlot}>
                    {props.leftIcon}
                </View>
            )}
            {!props.keepTextCentered && props.leftIcon}
            <Text style={[styles.text, props.textStyle]}>{props.title}</Text>
            {props.keepTextCentered && <View style={styles.iconSlot} />}
        </ReanimatedPressable>
    )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor : Colors.primary,
        borderRadius : 10,
        alignItems : "center",
        justifyContent : "center",
        paddingVertical : 18,
        flexDirection: "row",
    },
    iconSlot: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    text : {
        color : Colors.white1,
        fontSize : 16,
        fontFamily : Fonts.medium,
    }
})
