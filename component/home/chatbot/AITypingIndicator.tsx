import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Colors } from "../../../constants/Color";

const DOT_COUNT = 3;
const DOT_DELAYS = [0, 200, 400];

function TypingDot({ delay }: { delay: number }) {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 480,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(progress, {
                    toValue: 0,
                    duration: 720,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [delay, progress]);

    const translateY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -5],
    });
    const opacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1],
    });

    return (
        <Animated.View
            style={[
                styles.dot,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        />
    );
}

export default function AITypingIndicator() {
    return (
        <View style={styles.wrapper}>
            {Array.from({ length: DOT_COUNT }).map((_, index) => (
                <TypingDot key={DOT_DELAYS[index]} delay={DOT_DELAYS[index]} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 2,
        paddingVertical: 2,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 999,
        backgroundColor: Colors.primary,
    },
});
