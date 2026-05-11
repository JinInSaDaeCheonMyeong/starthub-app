import { useCallback, useState } from "react"
import { useError } from "../../util/useError"
import { useDisabled } from "../../util/useDisabled"
import { useSigninValid } from "./useSigninValid"

import { signin } from "../../../api/user"

import { ShowToast, ToastType } from "../../../util/ShowToast"

import { SigninScreenProps } from "../../../screens/SigninScreen"

import {
    SigninFormData,
    SigninRequest
} from "../../../type/user/signin.type"
import useAuthLoginSuccess from "../useAuthLoginSuccess"

export const useSigninScreen = ({ navigation }: SigninScreenProps) => {

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
    const { completeLogin } = useAuthLoginSuccess(navigation)

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

            ShowToast(
                "성공",
                "로그인에 성공하셨습니다",
                ToastType.SUCCESS
            )

            await completeLogin(data)

        } catch (error) {

            handleAxiosError(error, value => showError(value))

        } finally {

            enabledBtn()

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
