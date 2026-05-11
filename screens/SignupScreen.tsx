import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import BackButton from "../component/BackButton";
import CommonButton from "../component/CommonButton";
import SignupProgressBar from "../component/auth/signup/SignupProgressBar";
import SignupStepFields from "../component/auth/signup/SignupStepFields";
import SignupStepTitle from "../component/auth/signup/SignupStepTitle";
import { useSignupScreen } from "../hooks/auth/signup/useSignupScreen";
import useKeyboardVisible from "../hooks/util/useKeyboardVisible";
import { AuthStackParamList } from "../navigation/AuthStack";
import { Colors } from "../constants/Color";

export type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, "Signup">;

function getButtonText(progress: number, isCodeSent: boolean) {
    switch (progress) {
        case 1:
            return isCodeSent ? "인증하기" : "인증번호 전송";
        case 2:
            return "다음으로";
        case 3:
            return "회원가입 완료";
        default:
            return "잘못된 접근입니다";
    }
}

export default function SignupScreen(props: SignupScreenProps) {
    const {
        form: {
            email,
            verifyCode,
            password,
            checkPassword,
            checked,
            allChecked,
            setEmail,
            setVerifyNumber,
            setPassword,
            setCheckPassword,
            setChecked,
            setAllChecked,
        },
        actions: {
            goBack,
            handleNextStep,
            handleSendCode,
        },
        ui: {
            disabled,
            width,
            isCodeSent,
            progress,
            MAX_PROGRESS,
            time,
        },
    } = useSignupScreen(props);
    const isKeyboardVisible = useKeyboardVisible();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 54 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.contentWrapper}>
                        <View style={styles.backButton}>
                            <BackButton
                                width={20}
                                height={20}
                                color={Colors.black2}
                                onClick={goBack}
                            />
                        </View>
                        <View style={styles.formWrapper}>
                            <SignupProgressBar
                                width={width}
                                progress={progress}
                                maxProgress={MAX_PROGRESS}
                            />
                            <SignupStepTitle progress={progress} />
                            <SignupStepFields
                                progress={progress}
                                email={email}
                                verifyCode={verifyCode}
                                password={password}
                                checkPassword={checkPassword}
                                checked={checked}
                                allChecked={allChecked}
                                isCodeSent={isCodeSent}
                                time={time}
                                setEmail={setEmail}
                                setVerifyNumber={setVerifyNumber}
                                setPassword={setPassword}
                                setCheckPassword={setCheckPassword}
                                setChecked={setChecked}
                                setAllChecked={setAllChecked}
                                handleSendCode={handleSendCode}
                            />
                        </View>
                    </View>
                    <View style={Platform.OS === "android" && isKeyboardVisible ? styles.androidKeyboardPadding : undefined}>
                        <CommonButton
                            title={getButtonText(progress, isCodeSent)}
                            onPress={handleNextStep}
                            disabled={disabled}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    contentWrapper: {
        gap: 10,
    },
    backButton: {
        paddingVertical: 9,
    },
    formWrapper: {
        width: "100%",
        gap: 20,
    },
    androidKeyboardPadding: {
        paddingBottom: 28,
    },
});
