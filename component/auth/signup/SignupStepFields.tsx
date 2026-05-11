import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "expo-checkbox";
import AuthTextInput from "../AuthTextInput";
import SelectAgreement from "../SelectAgreement";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { CheckedKeyType, SignupFormData } from "../../../type/user/signup.type";

type SignupStepFieldsProps = {
    progress: number;
    email: string;
    verifyCode: string;
    password: string;
    checkPassword: string;
    checked: SignupFormData["checked"];
    allChecked: boolean;
    isCodeSent: boolean;
    time: number;
    setEmail: (value: string) => void;
    setVerifyNumber: (value: string) => void;
    setPassword: (value: string) => void;
    setCheckPassword: (value: string) => void;
    setChecked: (key: CheckedKeyType, value: boolean) => void;
    setAllChecked: (value: boolean) => void;
    handleSendCode: () => Promise<void>;
};

function formatTime(t: number) {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
}

export default function SignupStepFields({
    progress,
    email,
    verifyCode,
    password,
    checkPassword,
    checked,
    allChecked,
    isCodeSent,
    time,
    setEmail,
    setVerifyNumber,
    setPassword,
    setCheckPassword,
    setChecked,
    setAllChecked,
    handleSendCode,
}: SignupStepFieldsProps) {
    const selectItems: {
        key: number;
        value: boolean;
        title: string;
        checkedKey: CheckedKeyType;
        link: string;
    }[] = [
        { key: 1, value: checked.ONE, title: "[필수] 만 14세 이상입니다", checkedKey: "ONE", link: "" },
        { key: 2, value: checked.SECOND, title: "[필수] 스타트허브 이용약관 동의", checkedKey: "SECOND", link: "https://various-bougon-d76.notion.site/27f507c40eaf80acbf4afba41b9964b7" },
        { key: 3, value: checked.THIRD, title: "[필수] 스타트허브 개인정보 수집 및 이용 동의", checkedKey: "THIRD", link: "https://various-bougon-d76.notion.site/27f507c40eaf80bbb86dfc3db0b06e04?pvs=74" },
    ];

    switch (progress) {
        case 1:
            return (
                <>
                    <View style={styles.emailCodeWrapper}>
                        <AuthTextInput
                            value={email}
                            placeHolder="이메일"
                            isVerify={isCodeSent}
                            onChangeText={setEmail}
                            onSendVerify={handleSendCode}
                        />
                        {isCodeSent && (
                            <Text style={styles.verifyText}>
                                {`인증 번호가 전송되었습니다. ${formatTime(time)}`}
                            </Text>
                        )}
                    </View>
                    {isCodeSent && (
                        <AuthTextInput
                            value={verifyCode}
                            placeHolder="인증번호"
                            inputMode="numeric"
                            onChangeText={setVerifyNumber}
                        />
                    )}
                </>
            );
        case 2:
            return (
                <>
                    <AuthTextInput
                        value={password}
                        placeHolder="비밀번호를 입력해주세요"
                        isPassword
                        onChangeText={setPassword}
                    />
                    <AuthTextInput
                        value={checkPassword}
                        placeHolder="비밀번호를 다시 입력해주세요"
                        isPassword
                        onChangeText={setCheckPassword}
                    />
                </>
            );
        case 3:
            return (
                <View style={styles.selectContainer}>
                    <TouchableOpacity
                        style={styles.allSelectBox}
                        onPress={() => setAllChecked(!allChecked)}
                        activeOpacity={0.7}
                    >
                        <Checkbox
                            value={allChecked}
                            onValueChange={setAllChecked}
                            style={allChecked ? styles.selectCheckBox : styles.unSelectCheckBox}
                            color={allChecked ? Colors.primary : undefined}
                        />
                        <Text style={styles.allSelectText}>전체 선택</Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    {selectItems.map((item) => (
                        <SelectAgreement
                            key={item.key}
                            value={item.value}
                            title={item.title}
                            touchable={item.key !== 1}
                            onSelect={(value) => setChecked(item.checkedKey, value)}
                            onClick={() => {
                                if (item.link) {
                                    Linking.openURL(item.link);
                                }
                            }}
                        />
                    ))}
                </View>
            );
        default:
            return null;
    }
}

const styles = StyleSheet.create({
    emailCodeWrapper: {
        gap: 6,
    },
    verifyText: {
        fontFamily: Fonts.reqular,
        fontSize: 14,
    },
    selectCheckBox: {
        width: 24,
        height: 24,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 6,
        borderWidth: 1,
    },
    unSelectCheckBox: {
        width: 24,
        height: 24,
        borderColor: Colors.gray3,
        borderRadius: 6,
        borderWidth: 1,
    },
    selectContainer: {
        width: "100%",
        gap: 16,
    },
    allSelectBox: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    allSelectText: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        color: Colors.black1,
    },
    line: {
        width: "100%",
        height: 0,
        borderColor: Colors.gray3,
        borderStyle: "solid",
        borderWidth: 0.5,
    },
});
