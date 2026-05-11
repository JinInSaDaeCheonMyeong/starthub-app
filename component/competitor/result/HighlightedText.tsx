import { StyleSheet, Text } from "react-native";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

type HighlightedTextProps = {
    value?: string;
};

export default function HighlightedText({ value }: HighlightedTextProps) {
    if (!value) {
        return <Text style={styles.text}>값이 존재하지 않습니다</Text>;
    }

    return (
        <Text style={styles.text}>
            {value.split(/(<<.*?>>)/g).map((part, index) => {
                const match = part.match(/<<(.*?)>>/);
                if (!match) {
                    return (
                        <Text key={index} style={styles.text}>
                            {part}
                        </Text>
                    );
                }

                return (
                    <Text key={index} style={styles.highlight}>
                        {match[1]}
                    </Text>
                );
            })}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.reqular,
        color: Colors.black1,
        fontSize: 14,
    },
    highlight: {
        fontFamily: Fonts.semiBold,
        color: Colors.primary,
        fontSize: 14,
    },
});
