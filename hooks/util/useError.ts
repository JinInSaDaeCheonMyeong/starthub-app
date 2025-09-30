import { isAxiosError } from "axios"
import { useState } from "react"
import { DefaultErrorMessage, ErrorType } from "../../type/error/error.type"
import { ErrorResponse } from "../../type/util/response.type"

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
        console.log(errorText)
    }

    const handleAxiosError = (
        error : unknown,
        show : (value : string) => void
    ) => {
        if(isAxiosError(error)){
            const response = error.response
            if(!response){
                show('네트워크 오류가 발생하였습니다')
            } else {
                const message = (response.data as ErrorResponse).message
                if(message[message.length] === '.') {
                    show(message.slice(0, -1));
                }
                show(message + "입니다")
            }
        } else {
            show("예상치 못한 오류가 발생하였습니다")
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