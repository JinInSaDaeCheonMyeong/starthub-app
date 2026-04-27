import { useCallback, useState } from "react"
import { Platform } from "react-native"
import { NavigationProp } from "@react-navigation/native"

import { useError } from "../../util/useError"
import { useDisabled } from "../../util/useDisabled"
import { useSigninValid } from "./useSigninValid"

import { signin, getMe } from "../../../api/user"

import {
    getFCMToken,
    saveAccToken,
    saveRefToken
} from "../../../util/token"

import {
    getMyFCMTokens,
    registerFCMToken,
    removeFCMToken
} from "../../../api/notification"

import { ShowToast, ToastType } from "../../../util/ShowToast"

import {
    getDeviceTypeAsync,
    DeviceType as ExpoDeviceType
} from "expo-device"

import { SigninScreenProps } from "../../../screens/SigninScreen"
import { RootStackParamList } from "../../../navigation/RootStack"

import {
    SigninFormData,
    SigninRequest
} from "../../../type/user/signin.type"

import { DeviceType } from "../../../type/notification/notification.type"
import { useProfileStore } from "../../../store/profileStore"

export const useSigninScreen = ({ navigation }: SigninScreenProps) => {

    /** Root Navigation 접근용 */
    const rootNavigation =
        navigation as unknown as NavigationProp<RootStackParamList>

    /** 로그인 입력값 */
    const [formData, setFormData] = useState<SigninFormData>({
        email: "",
        password: ""
    })

    const {
        value: { errorText, errorVisible },
        handler: { showError, hideError, handleAxiosError }
    } = useError()

    const { validSigninForm } = useSigninValid()
    const setProfileData = useProfileStore((state) => state.setProfileData)

    const {
        disabled,
        disabledBtn,
        enabledBtn
    } = useDisabled()

    /**
     * formData 업데이트 함수
     */
    const updateFormData = useCallback<
        <K extends keyof SigninFormData>(
            key: K,
            value: SigninFormData[K]
        ) => void
    >((key, value) => {

        setFormData(prev => ({
            ...prev,
            [key]: value
        }))

        if (errorVisible) hideError()

    }, [errorVisible, hideError])

    const setEmail = useCallback(
        (value: string) => updateFormData("email", value),
        [updateFormData]
    )

    const setPassword = useCallback(
        (value: string) => updateFormData("password", value),
        [updateFormData]
    )

    /**
     * 로그인 처리
     */
    const handleSignin = async () => {

        disabledBtn()

        const email = formData.email.trim()
        const password = formData.password.trim()

        const validResult = validSigninForm({
            ...formData,
            email,
            password
        })

        if (!validResult.isValid) {
            ShowToast(
                "실패",
                validResult.message ?? "",
                ToastType.WARNING
            )
            enabledBtn()
            return
        }

        const loginRequest: SigninRequest = {
            email,
            password
        }

        try {

            /** 로그인 API */
            const { data } = await signin(loginRequest)

            /** 토큰 저장 */
            await saveAccToken(data.access)
            await saveRefToken(data.refresh)

            /** FCM 토큰 등록 */
            await handleFCMToken()

            ShowToast(
                "성공",
                "로그인에 성공하셨습니다",
                ToastType.SUCCESS
            )

            /** 사용자 정보 조회 */
            const { data: userData } = await getMe()
            setProfileData(userData)

            if (!data.isFirstLogin && userData.username) {
                successLogin()
            } else {

                navigation.reset({
                    index: 0,
                    routes: [{ name: "SignupInput" }]
                })

            }

        } catch (error) {

            handleAxiosError(error, value => showError(value))

        } finally {

            enabledBtn()

        }
    }

    /**
     * FCM 토큰 처리
     */
    const handleFCMToken = async () => {

        const FCMToken = await getFCMToken()

        if (!FCMToken) return

        try {

            /** 디바이스 타입 확인 */
            const device = await getDeviceTypeAsync()

            let deviceType: DeviceType = "UNKNOWN"

            if (Platform.OS === "ios") {
                deviceType =
                    device === ExpoDeviceType.PHONE
                        ? "IOS"
                        : device === ExpoDeviceType.TABLET
                            ? "IPADOS"
                            : "UNKNOWN"

            } else if (Platform.OS === "android") {

                deviceType =
                    device === ExpoDeviceType.PHONE
                        ? "ANDROID"
                        : device === ExpoDeviceType.TABLET
                            ? "ANDROID_TABLET"
                            : "UNKNOWN"
            }

            /** 기존 FCM 토큰 조회 */
            const { data: myFCMTokens } =
                await getMyFCMTokens()

            /** 동일 디바이스 타입 기존 토큰 제거 */
            for (const value of myFCMTokens) {

                if (
                    value.deviceType === deviceType &&
                    value.token !== FCMToken
                ) {
                    await removeFCMToken(value.token)
                }

            }

            /** 새 토큰 등록 */
            await registerFCMToken({
                token: FCMToken,
                deviceType
            })

        } catch (error) {

            throw error

        }
    }

    /**
     * 회원가입 화면 이동
     */
    const goSignupScreen = () => {
        disabledBtn()
        navigation.navigate("Signup")
        enabledBtn()
    }

    /**
     * 로그인 성공 후 홈 이동
     */
    const successLogin = () => {

        disabledBtn()

        rootNavigation.reset({
            index: 0,
            routes: [{ name: "HomeStack" }]
        })

        enabledBtn()
    }

    /**
     * 뒤로가기
     */
    const goBack = () => {

        disabledBtn()

        navigation.goBack()

        enabledBtn()
    }

    return {

        form: {
            ...formData,
            setEmail,
            setPassword
        },

        actions: {
            handleSignin,
            goSignupScreen,
            goBack
        },

        ui: {
            disabled,
            errorVisible,
            errorText
        }
    }
}
