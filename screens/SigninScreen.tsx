import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { AuthStackParamList } from "../navigation/AuthStack";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../constants/Color";
import AuthTextInput from "../component/auth/AuthTextInput";
import BackButton from "../component/BackButton";
import CommonButton from "../component/CommonButton";
import LinkActionText from "../component/auth/LinkActionText";
import { useSigninScreen } from "../hooks/auth/signin/useSigninScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Fonts } from "../constants/Fonts";
import { CompositeScreenProps } from "@react-navigation/core";
import { RootStackParamList } from "../navigation/RootStack";

export type SigninScreenProps = CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'Signin'>,
    StackScreenProps<RootStackParamList>
>;

export default function SigninScreen(props: SigninScreenProps) {

    const {
        form : {
            email,
            password,
            setEmail,
            setPassword
        },
        actions : {
            handleSignin,
            goSignupScreen,
            goBack
        },
        ui : {
            disabled,
            errorVisible,
            errorText
        }
    } = useSigninScreen(props)

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.backButton}>
                    <BackButton 
                    width={20} 
                    height={20} 
                    color={Colors.black2} 
                    onClick={() => {goBack()}}
                    />
                </View>
                <Text style={styles.titleText}>Start<Text style={styles.accentText}>Hub</Text> 계정 로그인</Text>
                <View style={styles.interactionContainer}>
                    <View style={styles.textInputContainer}>
                        <AuthTextInput 
                            value={email}
                            placeHolder="이메일"
                            placeHolderTextColor={Colors.gray2}
                            isPassword={false}
                            onChange={(text) => {
                                setEmail(text)
                            }}
                        />
                        <AuthTextInput 
                            value={password}
                            placeHolder="비밀번호" 
                            placeHolderTextColor={Colors.gray2}
                            isPassword={true}
                            onChange={(text) => {
                                setPassword(text)
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        {errorVisible && <Text style={styles.errorText}>{errorText}</Text>}
                        <CommonButton 
                            title="로그인" 
                            onPress={() => {handleSignin()}} 
                            disabled={disabled}
                        />
                    </View>
                    <View style={styles.signupContainer}>
                        <LinkActionText title="이메일 찾기" onPress={() => {}}/>
                        <Text style={styles.contourText}>⏐</Text>
                        <LinkActionText title="비밀번호 찾기" onPress={() => {}}/>
                        <Text style={styles.contourText}>⏐</Text>
                        <LinkActionText title="회원가입" onPress={() => {goSignupScreen()}}/>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        margin : 16,
        gap : 68
    },
    backButton : {
        marginTop : 22,
        marginBottom : 68
    },
    titleText : {
        width : "100%",
        fontSize : 24,
        fontFamily : Fonts.bold,
        textAlign : "center"
    },
    accentText : {
        width : "100%",
        fontSize : 24,
        fontFamily : Fonts.bold,
        textAlign : "center",
        color : Colors.primary
    },
    interactionContainer : {
        top : 68,
        alignItems : "center",
        gap : 24
    },
    textInputContainer : {
        gap : 16
    },
    buttonContainer : {
        width : "100%",
        gap : 8
    },
    signupContainer : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        gap : 12
    },
    errorText : {
        textAlign : "center",
        color : Colors.error,
        fontSize : 12,
        fontFamily : Fonts.semiBold,
    },
    signinButton : {
        backgroundColor : Colors.primary,
        borderRadius : 8,

    },
    contourText : {
        color : Colors.gray2,
        fontSize : 16,
        fontFamily : Fonts.semiBold,
    }
})