import { useCallback, useEffect, useState } from "react"
import { useError } from "../../../util/useError"
import { SignupInputScreenProps } from "../../../../screens/SignupInputScreen"
import { TypeInfo, SignupInputFormData, UserInfo } from "../../../../type/user/signupInput.type"
import { useDisabled } from "../../../util/useDisabled"
import StartupStatus from "../../../../constants/StartupStatus"
import { BackHandler } from "react-native"

export const useSignupInputScreen = ({ navigation }: SignupInputScreenProps, MAXPROGRESS: number) => {
    const [formData, setFormData] = useState<SignupInputFormData>({
        name: "",
        year: "",
        month: "",
        day: "",
        gender: "MALE",
        startupType: StartupStatus.EARLY_STAGE,
    })

    const [currentProgress, setCurrentProgress] = useState(1)
    const {
        value: { errorVisible, errorText },
        handler: { showError, hideError }
    } = useError()
    const { disabled, disabledBtn, enabledBtn } = useDisabled()

    const updateFormData = useCallback(<K extends keyof SignupInputFormData>(
        key: K,
        value: SignupInputFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        if (errorVisible) hideError()
    }, [errorVisible, hideError])

    const makeSetter = useCallback(<K extends keyof SignupInputFormData>(key: K) =>
        (value: SignupInputFormData[K]) => updateFormData(key, value), [updateFormData])

    const setName = makeSetter("name")
    const setYear = makeSetter("year")
    const setMonth = makeSetter("month")
    const setDay = makeSetter("day")
    const setGender = makeSetter("gender")
    const setStartupType = makeSetter("startupType");

    const goBack = useCallback((): boolean => {
        hideError();
        if (currentProgress <= 1) {
            console.log("크아악!2");
            navigation.goBack();
        } else {
            console.log("크아악!1");
            setCurrentProgress((prev) => prev - 1);
        }
        return true;
    }, [currentProgress, hideError, navigation])

    /** 다음 단계 */
    const goNext = async () => {
        disabledBtn()
        const username = formData.name.trim()
        const gender = formData.gender
        const year = formData.year.trim()
        const month = formData.month.trim()
        const day = formData.day.trim()
        const birth = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const startupType = formData.startupType;
        if(!username || !year || !month || !day){
            showError('이름 또는 생년월일을 입력해주세요')
            enabledBtn();
            return
        }
        if (currentProgress >= MAXPROGRESS) {
            console.log("마지막 단계 도착")
            // TODO: 서버 연결
            navigation.navigate("CompanyInput", {
                username,
                birth,
                gender,
                startupType
            })
        } else {
            setCurrentProgress(prev => prev + 1)
        }
        hideError();
        enabledBtn();
    }

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
            setName,
            setYear,
            setMonth,
            setDay,
            setGender,
            setStartupType
        },
        ui: {
            currentProgress,
            errorVisible,
            errorText,
            disabled
        },
        actions: {
            goBack,
            goNext
        }
    }
}
