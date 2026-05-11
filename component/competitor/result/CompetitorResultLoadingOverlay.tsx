import { Platform, StyleSheet, Text, View } from "react-native";
import { BlurView } from "@react-native-community/blur";
import * as Progress from "react-native-progress";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

export default function CompetitorResultLoadingOverlay() {
    return (
        <>
            <BlurView
                style={styles.blur}
                blurType="dark"
                blurAmount={
                    Platform.select({
                        ios: 6,
                        android: Math.round(32 * 0.06),
                    })
                }
            />
            <View style={styles.container}>
                <Progress.Circle
                    color={Colors.primary}
                    size={40}
                    indeterminate
                    thickness={300}
                />
                <Text style={styles.text}>
                    {"경쟁사 분석\n진행중"}
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    blur: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    container: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    text: {
        color: Colors.white1,
        marginTop: 16,
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        textAlign: "center",
    },
});
