import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import * as AppleAuthentication from "expo-apple-authentication";
import { AuthStackParamList } from "../navigation/AuthStack";
import { RootStackParamList } from "../navigation/RootStack";
import BackButton from "../component/BackButton";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";
import CommonButton from "../component/CommonButton";
import useOAuthLogin from "../hooks/auth/useOAuthLogin";

export type LoginSelectScreenProps = CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "LoginSelect">,
    NativeStackScreenProps<RootStackParamList>
>;

const loginOptions = [
    {
        key: "email",
        title: "이메일로 로그인",
        backgroundColor: Colors.primary,
        textColor: Colors.white1,
        borderColor: Colors.primary,
        icon: undefined,
    },
    {
        key: "google",
        title: "구글로 계속하기",
        backgroundColor: Colors.white1,
        textColor: Colors.black2,
        borderColor: Colors.gray3,
        icon: require("../assets/logos/google_logo.png"),
    },
    {
        key: "apple",
        title: "애플로 계속하기",
        backgroundColor: Colors.white1,
        textColor: Colors.black2,
        borderColor: Colors.gray3,
        icon: require("../assets/logos/apple_logo.png"),
    },
] as const;

export default function LoginSelectScreen({ navigation }: LoginSelectScreenProps) {
    const {
        loadingProvider,
        loginWithGoogle,
        loginWithApple,
    } = useOAuthLogin(navigation);

    const visibleLoginOptions = loginOptions.filter(
        (item) => item.key !== "apple" || Platform.OS === "ios"
    );

    const handlePress = (key: (typeof loginOptions)[number]["key"]) => {
        if (key === "email") {
            navigation.navigate("Signin");
            return;
        }

        if (key === "google") {
            loginWithGoogle();
            return;
        }

        loginWithApple();
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <BackButton
                    width={20}
                    height={20}
                    color={Colors.black2}
                    onClick={() => navigation.goBack()}
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>로그인 방식을 선택해주세요</Text>
                </View>

                <View style={styles.buttonContainer}>
                    {visibleLoginOptions.map((item) => {
                        if (item.key === "apple" && Platform.OS === "ios") {
                            return (
                                <View
                                    key={item.key}
                                    pointerEvents={loadingProvider !== null ? "none" : "auto"}
                                    style={loadingProvider !== null && styles.disabledAppleButton}
                                >
                                    <AppleAuthentication.AppleAuthenticationButton
                                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                        cornerRadius={10}
                                        style={styles.appleButton}
                                        onPress={loginWithApple}
                                    />
                                </View>
                            );
                        }

                        return (
                            <CommonButton
                                key={item.key}
                                title={item.title}
                                onPress={() => handlePress(item.key)}
                                disabled={loadingProvider !== null}
                                keepTextCentered
                                containerStyle={[
                                    styles.loginButton,
                                    {
                                        backgroundColor: item.backgroundColor,
                                        borderColor: item.borderColor,
                                    },
                                ]}
                                textStyle={{ color: item.textColor }}
                                leftIcon={
                                    item.icon ? (
                                        <Image source={item.icon} style={styles.loginIcon} contentFit="contain" />
                                    ) : undefined
                                }
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    backButton: {
        marginVertical: 8,
    },
    contentContainer: {
        paddingTop: 20,
        gap: 28,
    },
    titleContainer: {
        alignItems: "center",
    },
    titleText: {
        color: Colors.black1,
        fontSize: 22,
        fontFamily: Fonts.semiBold,
        textAlign: "center",
    },
    buttonContainer: {
        gap: 12,
    },
    loginButton: {
        minHeight: 56,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    loginIcon: {
        width: 24,
        height: 24,
    },
    appleButton: {
        width: "100%",
        height: 56,
    },
    disabledAppleButton: {
        opacity: 0.55,
    },
});
