import { isAxiosError } from "axios"
import { useState } from "react"
import { DefaultErrorMessage, ErrorType } from "../../type/error/error.type"
import { ErrorResponse } from "../../type/util/response.type"
import { ShowToast, ToastType } from "../../util/ShowToast"

export const useError = () => {
    const [errorVisible, setErrorVisible] = useState(false)
    const [errorText, setErrorText] = useState("")

    const showError = (value : string | undefined) => {
        if(!value) return 
        setErrorText(value)
        setErrorVisible(true)
    }

    const hideError = () => {
        setErrorVisible(false)
    }

    const toastErrorMessage = () => {
    }

    const handleAxiosError = (
        error : unknown,
        show : (value : string) => void
    ) => {
        if(isAxiosError(error)){
            const response = error.response
            if(!response){
                ShowToast('에러 발생', '네트워크 오류가 발생했습니다', ToastType.ERROR)
            } else {
                const message = (response.data as ErrorResponse).message
                ShowToast("에러 발생", message, ToastType.ERROR);
            }
        } else {
            ShowToast("에러 발생", '예상치 못한 오류가 발생했습니다', ToastType.ERROR);
        }
    }
    
    return {
        value : {
            errorVisible,
            errorText
        },
        handler : {
            showError,
            hideError,
            toastErrorMessage,
            handleAxiosError
        },
    }
}