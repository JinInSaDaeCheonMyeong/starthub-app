import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";

type ListEmptyStateProps = {
    message: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

export default function ListEmptyState({
    message,
    style,
    textStyle,
}: ListEmptyStateProps) {
    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, textStyle]}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 160,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium,
        textAlign: "center",
    },
});
