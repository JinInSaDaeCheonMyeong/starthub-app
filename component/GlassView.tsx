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
    overlayColor = "rgba(255, 255, 255, 0.6)"
} : GlassViewProps){
    // Android에서 BlurView는 CPU 블러 연산으로 매우 느림 — 단순 배경색으로 대체
    if (Platform.OS === 'android') {
        return (
            <View style={[styles.container, containerStyle, { backgroundColor: overlayColor }]}>
                {children}
            </View>
        );
    }

    const blurAmount = Math.round(100 * blurPercent);

    return (
        <View style={[styles.container, containerStyle]}>
            <BlurView
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, blurStyle]}
                blurType={blurType}
                blurAmount={blurAmount}
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
