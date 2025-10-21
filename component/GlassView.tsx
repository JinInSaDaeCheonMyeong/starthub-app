import React from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "@react-native-community/blur"
import { Colors } from "../constants/Color";

type GlassViewProps = {
    containerStyle ?: StyleProp<ViewStyle>,
    blurStyle ?: StyleProp<ViewStyle>,
    blurPercent ?: number
    blurType ?: 'dark' | 'light' | 'xlight'
    children ?: React.ReactNode | undefined,
    overlayColor ?: string | undefined
}

export default function GlassView({
    children,
    containerStyle,
    blurStyle,
    blurPercent = 0.6,
    blurType = 'light',
    overlayColor = "rgba(255, 255, 255, 1)"
} : GlassViewProps){
    const iosMax = 100;
    const androidMax = 25;

    const blurAmount =
        Platform.OS === "android"
            ? Math.round(androidMax * blurPercent)
            : Math.round(iosMax * blurPercent);

    const overlayColors = 
        Platform.OS === 'android'
            ? overlayColor
            : undefined
    
    return (
        <View style={[styles.container, containerStyle]}>
            <BlurView
                style={[StyleSheet.absoluteFill, blurStyle]}
                blurType={blurType}
                blurAmount={blurAmount}
                overlayColor={overlayColors}
                reducedTransparencyFallbackColor="transparent"
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