import { ValidError } from "../../../type/error/error.type"
import { useAuthValid } from "../../util/auth/useAuthValid"

export const useSignupValid = () => {
    const {
        isValidEmail,
        isValidPassword,
        isValidVerifyCode,
        isValidChecked
    } = useAuthValid()

    const validSignupForm = (
        email : string,
        verifyCode : string, 
        password : string, 
        checkPassword : string, 
        ONE : boolean, 
        SECOND : boolean,
        THIRD : boolean
        ) : ValidError => {
        if(!email && !verifyCode && !password && !checkPassword && !ONE && !SECOND && !THIRD){
            return {isValid : false, message : '입력을 확인해주세요'}
        }
        const emailValid = isValidEmail(email)
        if(!emailValid.isValid){
            return emailValid
        }
        const verifyCodeValid = isValidVerifyCode(verifyCode)
        if(!verifyCodeValid){
            return verifyCodeValid
        }
        const passwordValid = isValidPassword(password, checkPassword)
        if(!passwordValid.isValid){
            return passwordValid
        }
        const checkedValid = isValidChecked(ONE, SECOND, THIRD)
        if(!checkedValid.isValid){
            return checkedValid
        }
        return {isValid : true}
    }

    return {
        validSignupForm,
        isValidEmail,
        isValidPassword,
        isValidVerifyCode,
        isValidChecked,
    };
}