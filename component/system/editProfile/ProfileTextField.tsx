import { ReactNode } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

type ProfileTextFieldProps = TextInputProps & {
    icon?: ReactNode;
    label: string;
};

export default function ProfileTextField({
    icon,
    label,
    style,
    ...props
}: ProfileTextFieldProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>
                {icon}
                <Text style={styles.titleText}>{label}</Text>
            </View>
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={Colors.gray2}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    iconBox: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },
    titleText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.black2,
    },
    input: {
        fontSize: 14,
        fontFamily: Fonts.reqular,
        color: Colors.black1,
        backgroundColor: Colors.white1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray3,
        padding: 16,
    },
});
