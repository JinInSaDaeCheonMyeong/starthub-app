import React from "react";
import {
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleProp,
    ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type ReanimatedPressableProps = Omit<PressableProps, "style"> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
};

export default function ReanimatedPressable({
    children,
    style,
    scaleTo = 0.97,
    disabled,
    onPressIn,
    onPressOut,
    ...props
}: ReanimatedPressableProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: disabled ? 0.55 : 1,
    }));

    const handlePressIn = (event: GestureResponderEvent) => {
        if (!disabled) {
            scale.value = withTiming(scaleTo, { duration: 90 });
        }
        onPressIn?.(event);
    };

    const handlePressOut = (event: GestureResponderEvent) => {
        scale.value = withTiming(1, { duration: 120 });
        onPressOut?.(event);
    };

    return (
        <Pressable
            {...props}
            disabled={disabled}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}
