import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

type SignupProgressBarProps = {
    width: number;
    progress: number;
    maxProgress: number;
};

export default function SignupProgressBar({
    width,
    progress,
    maxProgress,
}: SignupProgressBarProps) {
    return (
        <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>
                {`${progress} of ${maxProgress}`}
            </Text>
            <Progress.Bar
                width={width - 32}
                progress={progress / maxProgress}
                color={Colors.primary}
                borderColor={Colors.white2}
                unfilledColor={Colors.white2}
                borderWidth={0}
                height={8}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    progressBarContainer: {
        width: "100%",
        gap: 8,
        alignItems: "flex-end",
    },
    progressBarText: {
        color: Colors.black2,
        fontFamily: Fonts.semiBold,
    },
});
