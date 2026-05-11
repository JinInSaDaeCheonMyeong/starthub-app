import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

type SignupStepTitleProps = {
    progress: number;
};

export default function SignupStepTitle({ progress }: SignupStepTitleProps) {
    switch (progress) {
        case 1:
            return <Text style={styles.containerText}>{"이메일을\n입력해주세요!"}</Text>;
        case 2:
            return (
                <View>
                    <Text style={styles.containerText}>{"비밀번호를\n입력해주세요!"}</Text>
                    <Text style={styles.passwordGuide}>
                        비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 해요
                    </Text>
                </View>
            );
        case 3:
            return <Text style={styles.containerText}>{"스타트허브를 이용하려면\n약관 동의가 필요해요!"}</Text>;
        default:
            return <Text style={styles.containerText}>잘못된 접근입니다</Text>;
    }
}

const styles = StyleSheet.create({
    containerText: {
        width: "100%",
        fontSize: 28,
        textAlign: "left",
        fontFamily: Fonts.semiBold,
    },
    passwordGuide: {
        fontSize: 12,
        fontFamily: Fonts.reqular,
        color: Colors.black1,
    },
});
