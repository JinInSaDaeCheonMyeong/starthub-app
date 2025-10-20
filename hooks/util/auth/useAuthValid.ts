import { ValidError } from "../../../type/error/error.type";

export const useAuthValid = () => {

    const isValidEmail = (email : string) : ValidError => {
        if(!email){
            return {isValid : false, message : "이메일을 입력해주세요"}
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return {isValid : false, message : "이메일 형식이 올바르지 않습니다"}
        }
        return {isValid : true}
    }

    const isValidPassword = (password : string, checkPassword ?: string) : ValidError => {
        if(!password){
            return {isValid : false, message : "비밀번호를 입력해주세요"}
        }
        if(checkPassword !== undefined){
            if(!checkPassword){
                return {isValid : false, message : "비밀번호 확인을 입력해주세요"}
            }
            if(password !== checkPassword){
                return {isValid : false, message : "비밀번호가 일치하지 않습니다"}
            }
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
        if(!passwordRegex.test(password)){
            return {isValid : false, message : "비밀번호는 대소문자, 숫자, 특수문자(@$!%*?&)가 \n포함 되어야 합니다"}
        }
        return {isValid : true}
    }

    const isValidVerifyCode = (verifyCode : string) : ValidError => {
        if(!verifyCode) {
            return {isValid : false, message : "인증번호를 입력해주세요"}
        }
        return {isValid : true}
    }

    const isValidChecked = (one : boolean, second : boolean, third : boolean) : ValidError => {
        if(!one || !second || !third){
            return {isValid : false, message : "필수 항목에 체크해 주세요"}
        }
        return {isValid : true}
    }

    return {
        isValidEmail,
        isValidPassword,
        isValidVerifyCode,
        isValidChecked,
    }
}