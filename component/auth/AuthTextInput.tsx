import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { Colors } from "../../constants/Color";
import VisibleIcon from "../../assets/icons/eye.svg";
import InVisibleIcon from "../../assets/icons/eye.fill.svg";
import { Fonts } from "../../constants/Fonts";
import { TextInputProps } from "react-native";

type AuthTextInputProps = TextInputProps & {
    placeHolder: string;
    value: string;
    isPassword?: boolean;
    isVerify ?: boolean;
    onChangeText: (text: string) => void;
    onSendVerify ?: (text : string) => void;
    error?: boolean;
    containerStyle?: ViewStyle;
};

export default function AuthTextInput({
    placeHolder,
    value,
    isPassword = false,
    isVerify = false,
    onChangeText,
    onSendVerify,
    error = false,
    containerStyle,
    ...props
}: AuthTextInputProps) {
    const [visible, setVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const labelAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(labelAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 180,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const labelY = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isPassword ? 22 : 20, 10],
    });

    const labelFontSize = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 10],
    });

    const labelColor = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.gray2, Colors.gray2],
    });

    const borderColor = error
        ? Colors.error
        : isFocused
        ? Colors.primary
        : Colors.gray3;

    return (
        <View style={[styles.container, { borderColor }, containerStyle]}>
            <Animated.Text
                style={[
                    styles.label,
                    {
                        top: labelY,
                        fontSize: labelFontSize,
                        color: labelColor,
                        opacity : !value || value.length === 0 ? 1 : 0
                    },
                ]}
            >
                {placeHolder}
            </Animated.Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isPassword ? visible : false}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                {...props}
            />

            {isPassword ? (
                <TouchableOpacity
                    hitSlop={8}
                    onPress={() => setVisible((prev) => !prev)}
                >
                    {visible ? (
                        <VisibleIcon width={22} height={22} color={Colors.gray2} />
                    ) : (
                        <InVisibleIcon width={22} height={22} color={Colors.gray2} />
                    )}
                </TouchableOpacity>
            ) : isVerify ? (
                <TouchableOpacity
                    hitSlop={8}
                    onPress={() => {
                        if(!!onSendVerify){
                            onSendVerify(value)
                        }
                    }}
                >
                    <Text style={styles.sendText}>
                        재전송
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: Colors.white1,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 20 : 16,
        position: "relative",
        flexDirection : 'row',
        gap : 8
    },
    label: {
        position: "absolute",
        left: 16,
        fontFamily: Fonts.reqular,
    },
    input: {
        fontFamily: Fonts.reqular,
        fontSize: 14,
        flex : 1,
        color: Colors.black2,
        padding: 0,
        margin: 0,
    },
    sendText : {
        fontSize : 14,
        fontFamily : Fonts.reqular,
        color : Colors.primary
    }
});
