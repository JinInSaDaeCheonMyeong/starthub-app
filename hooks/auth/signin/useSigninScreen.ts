import { useCallback, useEffect, useState } from "react";
import { useError } from "../../util/useError";
import { SigninFormData, SigninRequest } from "../../../type/user/signin.type";
import { getFCMToken, saveAccToken, saveRefToken } from "../../../util/token";
import { useSigninValid } from "./useSigninValid";
import { useDisabled } from "../../util/useDisabled";
import { getMe, signin } from "../../../api/user";
import { SigninScreenProps } from "../../../screens/SigninScreen";
import { ShowToast, ToastType } from "../../../util/ShowToast";
import { getMyFCMTokens, registerFCMToken, removeFCMToken } from "../../../api/notification";
import {getDeviceTypeAsync, DeviceType as ExpoDeviceType} from "expo-device"
import { Platform } from "react-native";
import { DeviceType } from "../../../type/notification/notification.type";
import {RootStackParamList} from "../../../navigation/RootStack";
import { NavigationProp } from "@react-navigation/native";

export const useSigninScreen = ({navigation} : SigninScreenProps) => {
    const rootNavigation = navigation as unknown as NavigationProp<RootStackParamList>;
    const [formData, setFormData] = useState<SigninFormData>({
        email : '',
        password : ''
    })
    const {
        value : {
            errorText,
            errorVisible
        },
        handler : {
            showError,
            hideError,
            handleAxiosError
        }
    } = useError()
    const {
        validSigninForm
    } = useSigninValid()
    const {
        disabled,
        disabledBtn,
        enabledBtn
    } = useDisabled()

    useEffect(() => {
    const controller = new AbortController()
    return () => controller.abort()
    }, [])

    const updateFormData = useCallback(<K extends keyof SigninFormData>(key : K, value : SigninFormData[K]) => {
        setFormData(prev => ({...prev, [key] : value}))
        if(errorVisible){
            hideError()
        }
    }, [errorVisible])

    const setEmail = useCallback((value : string) => updateFormData("email", value), [updateFormData])
    const setPassword = useCallback((value : string) => updateFormData("password", value), [updateFormData])

    const handleSignin = async () => {
        disabledBtn()
        const email = formData.email.trim()
        const password = formData.password.trim()
        const validResult = validSigninForm({...formData, email : email, password : password})
        if(!validResult.isValid){
            ShowToast('실패', validResult.message ?? '', ToastType.WARNING)
            enabledBtn()
            return
        }
        const loginRequest : SigninRequest = {
            email : email,
            password : password
        }
        try {
            const { data } = await signin(loginRequest)
            await saveAccToken(data.access)
            await saveRefToken(data.refresh)
            await handleFCMToken()
            ShowToast("성공", "로그인에 성공하셨습니다", ToastType.SUCCESS)
            const userData = await (await getMe()).data
            if(!data.isFirstLogin && !!userData.username){
                successLogin()
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "SignupInput" }],
                });
            }
        } catch (error) { 
            handleAxiosError(error, (value) => {showError(value)})
        } finally {
            enabledBtn()
        }
    }

    const handleFCMToken = async () => {
        try {
            const FCMToken = await getFCMToken();
            if (!FCMToken) return;
        
            const device = await getDeviceTypeAsync();
            const isIOS = Platform.OS === "ios";
            const isANDROID = Platform.OS === "android";
            const isPhone = device === ExpoDeviceType.PHONE;
            const isTablet = device === ExpoDeviceType.TABLET;
        
            let deviceType: DeviceType = "UNKNOWN";
            if (isIOS) {
                deviceType = isPhone ? "IOS" : isTablet ? "IPADOS" : "UNKNOWN";
            } else if (isANDROID) {
                deviceType = isPhone ? "ANDROID" : isTablet ? "ANDROID_TABLET" : "UNKNOWN";
            }
        
            const { data: myFCMTokens } = await getMyFCMTokens();
        
            if (myFCMTokens.length !== 0) {
                for (const value of myFCMTokens) {
                    if (value.deviceType === deviceType && value.token !== FCMToken) {
                        console.log("기존 토큰 삭제:", value.token);
                        await removeFCMToken(value.token);
                    }
                }
            }
            await registerFCMToken({
                token: FCMToken,
                deviceType,
            });
        
            console.log("FCM 토큰 등록 완료:", deviceType);
        } catch (error) {
            throw error
        }
    };

    const goSignupScreen = () => {
        disabledBtn()
        navigation.navigate("Signup")
        enabledBtn()
    }

    const successLogin = () => {
        disabledBtn();
        rootNavigation.reset({
            index: 0,
            routes: [{ name: "HomeStack" }],
        });
        enabledBtn();
    };

    const goBack = () => {
        disabledBtn()
        navigation.goBack()
        enabledBtn()
    }

    return {
        form : {
            ...formData,
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
    }
}