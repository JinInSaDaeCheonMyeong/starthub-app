import { useCallback, useState } from "react"
import { useError } from "../../../util/useError"
import { SignupInputScreenProps } from "../../../../screens/SignupInputScreen"
import { TypeInfo, SignupInputFormData, UserInfo } from "../../../../type/user/signupInput.type"
import { useDisabled } from "../../../util/useDisabled"
import StartupType from "../../../../constants/StartupType"

export const useSignupInputScreen = ({ navigation }: SignupInputScreenProps, MAXPROGRESS: number) => {
    const [formData, setFormData] = useState<SignupInputFormData>({
        name: "",
        year: "",
        month: "",
        day: "",
        gender: "MALE",
        startupType: StartupType.EARLY_STARTUP,

        companyName: "",
        companyIntro: '',
        personNumber: '',
        companySite: '',
        getMoneyYear: '',
        earlyCompanyLocation: '',
        earlyInterestList: [],

        preCompanyLocation: '',
        preInterestList: []
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
    const setStartupType = makeSetter("startupType")
    const setCompanyName = makeSetter("companyName");
    const setCompanyIntro = makeSetter("companyIntro");
    const setPersonNumber = makeSetter("personNumber");
    const setCompanySite = makeSetter("companySite");
    const setGetMoneyYear = makeSetter("getMoneyYear");
    const setEarlyCompanyLocation = makeSetter("earlyCompanyLocation");
    const setEarlyInterestList = makeSetter("earlyInterestList");
    const setPreCompanyLocation = makeSetter("preCompanyLocation");
    const setPreInterestList = makeSetter("preInterestList");

    const goBack = () => {
        hideError()
        if (currentProgress <= 1) navigation.goBack()
        else setCurrentProgress(prev => prev - 1)
    }

    const getValidData = (): UserInfo | TypeInfo | undefined => {
        const { name, year, month, day, startupType, gender } = formData
        const stepData: Record<number, UserInfo | TypeInfo> = {
            1: { name: name.trim(), year: year.trim(), month: month.trim(), day: day.trim() },
            2: { startupType, gender }
        }
        return stepData[currentProgress]
    }

    /** 다음 단계 */
    const goNext = async () => {
        disabledBtn()
        // const validData = getValidData()
        // if (!validData) {
        //     enabledBtn()
        //     return
        // }
        // const validResult = validSignupInputForm(currentProgress, validData)

        // if (!validResult.isValid) {
        //     showError(validResult.message)
        //     enabledBtn()
        //     return
        // }

        hideError()
        enabledBtn()

        if (currentProgress >= MAXPROGRESS) {
            console.log("마지막 단계 도착")
            // TODO: 서버 연결
        } else {
            setCurrentProgress(prev => prev + 1)
        }
    }

    return {
        form: {
            ...formData,
            setName,
            setYear,
            setMonth,
            setDay,
            setGender,
            setStartupType,
            setCompanyName,
            setCompanyIntro,
            setPersonNumber,
            setCompanySite,
            setGetMoneyYear,
            setEarlyCompanyLocation,
            setEarlyInterestList,
            setPreCompanyLocation,
            setPreInterestList
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
