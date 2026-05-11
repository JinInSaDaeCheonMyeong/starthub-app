import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

type SegmentOption<T extends string | boolean> = {
    label: string;
    value: T;
};

type SegmentOptionGroupProps<T extends string | boolean> = {
    options: SegmentOption<T>[];
    selectedValue: T;
    onSelect: (value: T) => void;
};

export default function SegmentOptionGroup<T extends string | boolean>({
    options,
    selectedValue,
    onSelect,
}: SegmentOptionGroupProps<T>) {
    return (
        <View style={styles.container}>
            {options.map((option) => {
                const selected = option.value === selectedValue;
                return (
                    <TouchableOpacity
                        key={String(option.value)}
                        onPress={() => onSelect(option.value)}
                        style={[
                            styles.box,
                            {
                                borderColor: selected ? Colors.primary : Colors.gray3,
                                backgroundColor: selected ? "rgba(36,102,244, 0.1)" : Colors.white1,
                            },
                        ]}
                    >
                        <Text style={[styles.text, { color: selected ? Colors.primary : Colors.gray2 }]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },
    box: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.white2,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
    },
    text: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: Colors.black2,
    },
});
