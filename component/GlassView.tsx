import React, { ReactElement } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "@react-native-community/blur"
import { Colors } from "../constants/Color";

type GlassViewProps = {
    containerStyle ?: StyleProp<ViewStyle>,
    blurStyle ?: StyleProp<ViewStyle>,
    blurAmount ?: number
    blurType ?: 'dark' | 'light'
    children ?: React.ReactNode | undefined
}

export default function GlassView({
    children,
    containerStyle,
    blurStyle,
    blurAmount = 60,
    blurType = 'light'
} : GlassViewProps){
    return (
        <View style={[styles.container, containerStyle]}>
            <BlurView
                style={[StyleSheet.absoluteFill, blurStyle]}
                blurType={blurType}
                blurAmount={blurAmount}
                reducedTransparencyFallbackColor="white"
            />
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        overflow : 'hidden',
        backgroundColor : 'rgba(255, 255, 255, 0.6)',
        borderRadius : 10,
        borderWidth : 1,
        borderColor : Colors.white1
    }
})