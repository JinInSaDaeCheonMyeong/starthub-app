import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import GlassView from "../../GlassView";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import HighlightedText from "./HighlightedText";

type ResultDataSectionProps = {
    title: string;
    children: ReactNode;
    showDivider?: boolean;
};

type ResultDataWrapProps = {
    title: string;
    body?: string | string[];
};

export function ResultDataSection({
    title,
    children,
    showDivider = true,
}: ResultDataSectionProps) {
    return (
        <>
            <View style={styles.dataContainer}>
                <Text style={styles.containerTitle}>{title}</Text>
                <View style={styles.dataBox}>
                    {children}
                </View>
            </View>
            {showDivider ? <View style={styles.divider} /> : null}
        </>
    );
}

export function ResultDataWrap({ title, body }: ResultDataWrapProps) {
    return (
        <View style={styles.dataWrap}>
            <Text style={styles.boxTitle}>{title}</Text>
            {Array.isArray(body) ? (
                body.map((value, index) => (
                    <GlassView key={index} containerStyle={styles.glassView}>
                        <HighlightedText value={value} />
                    </GlassView>
                ))
            ) : (
                <GlassView containerStyle={styles.glassView}>
                    <HighlightedText value={body} />
                </GlassView>
            )}
        </View>
    );
}

export const resultTextStyles = StyleSheet.create({
    boxTitle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: Colors.black1,
    },
});

const styles = StyleSheet.create({
    dataContainer: {
        gap: 12,
        marginHorizontal: 16,
    },
    dataBox: {
        gap: 24,
    },
    dataWrap: {
        gap: 12,
    },
    glassView: {
        padding: 16,
    },
    containerTitle: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: Colors.black1,
    },
    boxTitle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: Colors.black1,
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: Colors.gray3,
        marginHorizontal: 16,
        marginTop: 24,
    },
});
