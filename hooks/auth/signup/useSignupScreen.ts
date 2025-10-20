import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, useWindowDimensions } from "react-native";
import { SignupScreenProps } from "../../../screens/SignupScreen";
import { useError } from "../../util/useError";
import { useDisabled } from "../../util/useDisabled";
import { useSignupValid } from "./useSignupValid";
import { sendcode, verify } from "../../../api/email";
import { signup } from "../../../api/user";
import { ShowToast, ToastType } from "../../../util/ShowToast";
import { SignupFormData, SignupRequest } from "../../../type/user/signup.type";
import { SendcodeRequest } from "../../../type/email/sendcode.type";
import { VerifyRequest } from "../../../type/email/verify.type";

export const useSignupScreen = ({ navigation }: SignupScreenProps) => {
    const [formData, setFormData] = useState<SignupFormData>({
        email: "",
        verifyCode: "",
        password: "",
        checkPassword: "",
        checked: { ONE: false, SECOND: false, THIRD: false },
        allChecked: false,
    });

    const [progress, setProgress] = useState(1);
    const [isCodeSent, setIsCodeSent] = useState(false);

    // 5분(300초) 타이머
    const [time, setTime] = useState(300);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const MAX_PROGRESS = 3;

    const { width } = useWindowDimensions();
    const { disabled, disabledBtn, enabledBtn } = useDisabled();
    const { validSignupForm, isValidEmail, isValidPassword, isValidChecked, isValidVerifyCode } = useSignupValid();

    const {
        value: { errorText, errorVisible },
        handler: { showError, hideError, handleAxiosError },
    } = useError();

    // 📌 공통 상태 업데이트
    const updateFormData = useCallback(
        <K extends keyof SignupFormData>(key: K, value: SignupFormData[K]) => {
            setFormData((prev) => ({ ...prev, [key]: value }));
            if (errorVisible) hideError();
        },
        [errorVisible]
    );

    // === Setter helpers ===
    const setEmail = useCallback((v: string) => updateFormData("email", v), [updateFormData]);
    const setVerifyNumber = useCallback((v: string) => updateFormData("verifyCode", v), [updateFormData]);
    const setPassword = useCallback((v: string) => updateFormData("password", v), [updateFormData]);
    const setCheckPassword = useCallback((v: string) => updateFormData("checkPassword", v), [updateFormData]);

    const setChecked = useCallback((key: keyof SignupFormData["checked"], value: boolean) => {
        setFormData((prev) => {
            const newChecked = { ...prev.checked, [key]: value };
            const allChecked = newChecked.ONE && newChecked.SECOND && newChecked.THIRD;
            return { ...prev, checked: newChecked, allChecked };
        });
    }, []);

    const setAllChecked = (value: boolean) => {
        updateFormData("checked", { ONE: value, SECOND: value, THIRD: value });
        updateFormData("allChecked", value);
    };

    // === ⏰ 타이머 관리 ===
    useEffect(() => {
        if (!isCodeSent) return; // 코드 발송 안 됐으면 타이머 돌리지 않음
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    ShowToast("인증 코드", "인증 시간이 만료되었습니다. 다시 요청해주세요.", ToastType.WARNING);
                    setIsCodeSent(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // cleanup
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isCodeSent]);

    // === 코드 발송 ===
    const handleSendCode = async () => {
        const email = formData.email.trim();
        const valid = isValidEmail(email);
        if (!valid.isValid) return ShowToast("회원가입", valid.message ?? "", ToastType.WARNING);

        disabledBtn();
        try {
            const data: SendcodeRequest = { email };
            await sendcode(data);
            setIsCodeSent(true);
            setTime(300); // ✅ 5분 초기화
            ShowToast("요청 성공", "인증번호의 유효 시간은 5분입니다", ToastType.SUCCESS);
        } catch (error) {
            handleAxiosError(error, (msg) => ShowToast("회원가입", msg, ToastType.WARNING));
        } finally {
            enabledBtn();
        }
    };

    // === 코드 검증 ===
    const handleVerifyCode = async () => {
        const { email, verifyCode } = formData;
        if (!email.trim() || !verifyCode.trim()) return ShowToast("회원가입", "입력을 확인해주세요", ToastType.WARNING);

        const emailValid = isValidEmail(email);
        const codeValid = isValidVerifyCode(verifyCode);
        if (!emailValid.isValid) return ShowToast("회원가입", emailValid.message ?? "", ToastType.WARNING);
        if (!codeValid.isValid) return ShowToast("회원가입", codeValid.message ?? "", ToastType.WARNING);

        disabledBtn();
        try {
            const data: VerifyRequest = { email, code: verifyCode };
            await verify(data);
            ShowToast("인증 성공", "이메일 인증이 완료되었습니다", ToastType.SUCCESS);
            setProgress(2);

            if (timerRef.current) clearInterval(timerRef.current);
        } catch (error) {
            handleAxiosError(error, (msg) => ShowToast("회원가입", msg, ToastType.WARNING));
        } finally {
            enabledBtn();
        }
    };

    // === 비밀번호 설정 ===
    const handlePasswordSetup = () => {
        const { password, checkPassword } = formData;
        const result = isValidPassword(password.trim(), checkPassword.trim());
        if (!result.isValid) return ShowToast("회원가입", result.message ?? "", ToastType.WARNING);

        ShowToast("회원가입", "비밀번호 설정에 성공했습니다", ToastType.SUCCESS);
        setProgress(3);
    };

    // === 회원가입 요청 ===
    const handleSignup = async () => {
        const { email, password, verifyCode, checked } = formData;
        const result = validSignupForm(email, verifyCode, password, password, checked.ONE, checked.SECOND, checked.THIRD);
        if (!result.isValid) return ShowToast("회원가입", result.message ?? "", ToastType.WARNING);

        disabledBtn();
        try {
            const data: SignupRequest = { email, password };
            await signup(data);
            ShowToast("성공", "회원가입이 완료되었습니다", ToastType.SUCCESS);
            navigation.goBack();
        } catch (error) {
            handleAxiosError(error, (msg) => ShowToast("회원가입", msg, ToastType.WARNING));
        } finally {
            enabledBtn();
        }
    };

    // === 다음 단계 ===
    const handleNextStep = async () => {
        switch (progress) {
            case 1:
                return isCodeSent ? await handleVerifyCode() : await handleSendCode();
            case 2:
                return handlePasswordSetup();
            case 3:
                return await handleSignup();
            default:
                return;
        }
    };

    const goBack = useCallback((): boolean => {
        disabledBtn();
        if (progress <= 1) {
            navigation.goBack();
        } else {
            setProgress((prev) => prev - 1);
        }
        enabledBtn();
        return true;
    }, [progress, hideError, navigation])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            goBack
        );
        return () => {
            backHandler.remove();
        };
    }, [goBack]);

    return {
        form: {
            ...formData,
            setEmail,
            setVerifyNumber,
            setPassword,
            setCheckPassword,
            setChecked,
            setAllChecked,
        },
        actions: {
            goBack,
            handleNextStep,
            handleSendCode,
        },
        ui: {
            width,
            disabled,
            progress,
            isCodeSent,
            MAX_PROGRESS,
            time, // 남은 시간 (초 단위)
        },
    };
};
