import React, { useEffect, useState } from "react";
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { AuthStackParamList } from "../navigation/AuthStack";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../constants/Color";
import AuthTextInput from "../component/auth/AuthTextInput";
import BackButton from "../component/BackButton";
import CommonButton from "../component/CommonButton";
import LinkActionText from "../component/auth/LinkActionText";
import { useSigninScreen } from "../hooks/auth/signin/useSigninScreen";
import { Fonts } from "../constants/Fonts";
import { CompositeScreenProps } from "@react-navigation/core";
import { RootStackParamList } from "../navigation/RootStack";
import StartHubIcon from "../assets/logos/starthub-logo.svg";
import StartHubTitleIcon from "../assets/logos/starthub-title-logo.svg";

export type SigninScreenProps = CompositeScreenProps<
    StackScreenProps<AuthStackParamList, "Signin">,
    StackScreenProps<RootStackParamList>
>;

export default function SigninScreen(props: SigninScreenProps) {
    const {
        form: { email, password, setEmail, setPassword },
        actions: { handleSignin, goSignupScreen, goBack },
        ui: { disabled },
    } = useSigninScreen(props);

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 54 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.contentWrapper}>
                        <View style={{ gap: 10 }}>
                            <View style={styles.backButton}>
                                <BackButton
                                    width={20}
                                    height={20}
                                    color={Colors.black2}
                                    onClick={goBack}
                                />
                            </View>

                            <View style={styles.interactionContainer}>
                                <View>
                                    <StartHubIcon width={40} height={38} color={Colors.primary} />
                                    <StartHubTitleIcon width={122} height={33} />
                                    <Text style={styles.titleText}>시작하기</Text>
                                </View>

                                <View style={styles.textInputContainer}>
                                    <AuthTextInput
                                        value={email}
                                        placeHolder="이메일을 입력해주세요"
                                        onChangeText={setEmail}
                                    />
                                    <AuthTextInput
                                        value={password}
                                        placeHolder="비밀번호를 입력해주세요"
                                        isPassword
                                        onChangeText={setPassword}
                                    />
                                </View>

                                <View style={styles.signupContainer}>
                                    <LinkActionText
                                        title="회원가입"
                                        onPress={goSignupScreen}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 👇 Android에서만 키보드 열릴 때 padding 적용 */}
                    <View style={Platform.OS === 'android' && isKeyboardVisible ? { paddingBottom: 28 } : undefined}>
                        <CommonButton
                            title="로그인"
                            onPress={handleSignin}
                            disabled={disabled}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "space-between",
    },
    backButton: {
        marginVertical: 8,
    },
    titleText: {
        color: Colors.black1,
        fontSize: 24,
        fontFamily: Fonts.semiBold,
    },
    interactionContainer: {
        gap: 20,
    },
    textInputContainer: {
        gap: 16,
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
});
