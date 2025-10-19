import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import { Colors } from "../constants/Color";
import {Keyboard, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View} from "react-native";
import BackButton from "../component/BackButton";
import AuthTextInput from "../component/auth/AuthTextInput";
import CommonButton from "../component/CommonButton";
import Checkbox from "expo-checkbox";
import SelectAgreement from "../component/auth/SelectAgreement";
import { useSignupScreen } from "../hooks/auth/signup/useSignupScreen";
import { Fonts } from "../constants/Fonts";
import { useState } from "react";
import * as Progress from 'react-native-progress'
import { sendcode } from "../api/email";

export type SignupScreenProps = StackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen(props : SignupScreenProps){
    const {
        form : {
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
            setAllChecked
        },
        actions : {
            goBack,
            requestSignup,
            requestSendcode
        },
        ui : {
            errorText,
            errorVisible,
            disabled
        }
    } = useSignupScreen(props)

    const selectItem = [
        {key : 1, value : checked.ONE, title : "[필수] 만 14세 이상입니다", setChecked : setChecked, checkedKey : 'ONE', link : ""},
        {key : 2, value : checked.SECOND, title : "[필수] 스타트허브 이용약관 동의", setChecked : setChecked, checkedKey : 'SECOND', link : "https://various-bougon-d76.notion.site/27f507c40eaf80acbf4afba41b9964b7?source=copy_link"},
        {key : 3, value : checked.THIRD, title : "[필수] 스타트허브 개인정보 수집 및 이용 동의", setChecked : setChecked, checkedKey : 'THIRD', link : "https://various-bougon-d76.notion.site/27f507c40eaf80bbb86dfc3db0b06e04?pvs=74"}
    ]

    const [buttonText, setButtonText] = useState('인증번호 전송')
    const {width} = useWindowDimensions()
    const [currentProgress, setCurrentProgress] = useState(3)
    const MAXPROGRESS = 3
    const [isSend, setIsSend] = useState(false)
    const getTitleView = () => {
        switch(currentProgress) {
            case 1:
                return <Text style={styles.containerText}>{'이메일을\n입력해주세요!'}</Text>
            case 2:
                return <View>
                    <Text style={styles.containerText}>{'비밀번호를\n입력해주세요!'}</Text>
                    <Text style={{fontSize : 12, fontFamily : Fonts.reqular, color : Colors.black1}}>비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 해요</Text>
                </View>
            case 3:
                return <Text style={styles.containerText}>{'스타트허브를 이용하려면\n약관 동의가 필요해요!'}</Text>
            default:
                return <Text style={styles.containerText}>{'잘못된 접근입니다'}</Text>
        }
    }

    const getInputView = () => {
        switch(currentProgress) {
            case 1:
                return (
                    <>
                        <View style={{gap : 6}}>
                            <AuthTextInput
                                value={email}
                                placeHolder="이메일"
                                isVerify={isSend}
                                onChangeText={(text) => setEmail(text)}
                                onSendVerify={(text) => {}}
                            />
                            <Text style={{
                                fontFamily : Fonts.reqular,
                                fontSize : 14
                            }}>
                                    {`인증 번호가 전송되었습니다. ${'05:00'}`}
                            </Text>
                        </View>
                        <AuthTextInput
                            value={verifyCode}
                            placeHolder="인증번호"
                            inputMode="numeric"
                            onChangeText={(text) => {
                                setVerifyNumber(text)
                            }}
                        />
                    </>
                )
            case 2: 
                return (
                    <>
                        <AuthTextInput
                            value={password}
                            placeHolder="비밀번호를 입력해주세요"
                            isPassword
                            onChangeText={(text) => {
                                setPassword(text)
                            }}
                        />
                        <AuthTextInput
                            value={password}
                            placeHolder="비밀번호를 다시 입력해주세요"
                            isPassword
                            onChangeText={(text) => {
                                setPassword(text)
                            }}
                        />
                    </>
                )
            case 3:
                return (
                    <View style={styles.selectContainer}>
                        <View style={styles.allSelectBox}>
                            <Checkbox
                                value={allChecked}
                                onChange={() => {console.log(allChecked)}}
                                onValueChange={(value) => {
                                    setAllChecked(value)
                                }}
                                style={allChecked ? styles.selectCheckBox : styles.unSelectCheckBox}
                                color={allChecked ? Colors.primary : undefined}
                            />
                            <Text style={styles.allSelectText}>전체 선택</Text>
                        </View>
                        <View style={styles.line}/>
                        {selectItem.map(item => (
                            <SelectAgreement
                                key={item.key}
                                value={item.value}
                                title={item.title}
                                touchable={item.key !== 1 ? true : false}
                                onSelect={(value) => {setChecked(item.checkedKey, value)}}
                                onClick={() => {
                                    Linking.openURL(item.link)
                                }} 
                            />
                        ))}
                    </View>
                )
        }
    }

    return(
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
                    <View style={{gap : 10}}>
                        <View style={styles.backButton}>
                            <BackButton
                                width={20}
                                height={20}
                                color={Colors.black2}
                                onClick={() => {goBack()}}
                            />
                        </View>
                        <View style={{
                            width : "100%",
                            gap : 20
                        }}>
                            <View style={styles.progressBarContainer}>
                                <Text 
                                    style={styles.progressBarText}
                                >
                                    {`${currentProgress} of ${MAXPROGRESS}`}
                                </Text>
                                <Progress.Bar
                                    width={width - 32}
                                    progress={currentProgress / MAXPROGRESS}
                                    color={Colors.primary}
                                    borderColor={Colors.white2}
                                    unfilledColor={Colors.white2}
                                    borderWidth={0}
                                    height={8}
                                />
                            </View>
                            {getTitleView()}
                            {getInputView()}
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonButton
                            title={buttonText}
                            onPress={() => {requestSignup()}}
                            disabled={disabled}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    statusbar : {
        backgroundColor : Colors.white1
    },
    container : {
        flex : 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    backButton: {
        paddingVertical : 9
    },
    titleText : {
        width : "100%",
        fontSize : 24,
        fontFamily : Fonts.bold,
        textAlign : "center",
        paddingVertical : 68
    },
    accentText : {
        width : "100%",
        fontSize : 24,
        fontFamily : Fonts.bold,
        textAlign : "center",
        color : Colors.primary
    },
    interactionContainer : {
        alignItems : "center",
        gap : 24
    },
    emailContainer : {
        width : "100%",
        gap : 16
    },
    emailInputContainer : {
        flexDirection : "row",
        width : "100%",
        justifyContent : "space-between",
        alignItems : "center",
        gap : 12
    },
    emailInputWrapper : {
        flex : 1
    },
    passwordContainer : {
        gap : 16,
        width : '100%'
    },
    buttonContainer : {
        width : "100%",
        gap : 8,
    },
    signupContainer : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        gap : 12
    },
    containerText : {
        width : '100%',
        fontSize : 28,
        textAlign : 'left',
        fontFamily : Fonts.semiBold,
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
    },
    verifyButton : {
        backgroundColor : Colors.white1,
        borderColor : Colors.primary,
        borderStyle : "solid",
        borderWidth : 1,
        padding : 12,
        ...Platform.select({
            ios : {
                padding : 13,
            },
            android : {
                padding : 17
            }
        }),
        borderRadius : 8
    },
    verifyButtonText : {
        fontSize : 14,
        color : Colors.primary
    },
    selectCheckBox : {
        width : 24,
        height : 24,
        borderColor : Colors.primary,
        backgroundColor : Colors.primary,
        borderRadius : 6,
        borderWidth : 1
    },
    unSelectCheckBox : {
        width : 24,
        height : 24,
        borderColor : Colors.gray3,
        borderRadius : 6,
        borderWidth : 1
    },
    selectContainer : {
        width : "100%",
        gap : 16
    },
    allSelectBox : {
        flexDirection : "row",
        gap : 8,
        alignItems : "center"
    },
    allSelectText : {
        fontSize : 14,
        fontFamily : Fonts.semiBold,
        color : Colors.black1
    },
    line : {
        width : "100%",
        height : 0,
        borderColor : Colors.gray3,
        borderStyle : "solid",
        borderWidth : 0.5
    },
    progressBarContainer : {
        width : "100%",
        gap : 8,
        alignItems : "flex-end",
    },
    progressBarText : {
        color : Colors.black2,
        fontFamily : Fonts.semiBold
    }
})