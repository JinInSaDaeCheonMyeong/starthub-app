import { useCallback, useEffect, useState } from "react"
import { BackHandler } from "react-native"

import { useError } from "../../../util/useError"
import { useDisabled } from "../../../util/useDisabled"

import { SignupInputScreenProps } from "../../../../screens/SignupInputScreen"
import { SignupInputFormData } from "../../../../type/user/signupInput.type"

import StartupStatus from "../../../../constants/StartupStatus"
import { removeTokens } from "../../../../util/token"
import { resetScheduleList } from "../../../../util/Schedule"

export const useSignupInputScreen = (
    { navigation }: SignupInputScreenProps,
    MAXPROGRESS: number
) => {

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

    const getDaysInMonth = useCallback((year: number, month: number) => {
        return new Date(year, month, 0).getDate()
    }, [])

    const updateFormData = useCallback(<K extends keyof SignupInputFormData>(
        key: K,
        value: SignupInputFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        if (errorVisible) hideError()
    }, [errorVisible, hideError])

    const makeSetter = useCallback(<K extends keyof SignupInputFormData>(key: K) =>
            (value: SignupInputFormData[K]) => updateFormData(key, value)
        , [updateFormData])

    const setName = makeSetter("name")
    const setYear = makeSetter("year")
    const setMonth = makeSetter("month")
    const setGender = makeSetter("gender")
    const setStartupType = makeSetter("startupType")

    const setDay = useCallback((value: string) => {
        const year = Number(formData.year)
        const month = Number(formData.month)
        let day = Number(value)

        if (year && month) {
            const maxDay = getDaysInMonth(year, month)
            if (day > maxDay) day = maxDay
        }

        updateFormData("day", String(day))
    }, [formData.year, formData.month, getDaysInMonth, updateFormData])

    const goBack = useCallback((): boolean => {
        hideError()

        if (currentProgress > 1) {
            setCurrentProgress(prev => prev - 1)
            return true
        }

        removeTokens()
        resetScheduleList()

        navigation.reset({
            index: 0,
            routes: [{
                name: "AuthStack" as any,
                state: {
                    routes: [{ name: "Welcome" }],
                    index: 0,
                }
            }]
        })

        return true
    }, [currentProgress, hideError, navigation])

    const goNext = () => {
        disabledBtn()

        const username = formData.name.trim()
        const year = formData.year.trim()
        const month = formData.month.trim()
        const day = formData.day.trim()

        if (!username || !year || !month || !day) {
            showError("이름 또는 생년월일을 입력해주세요")
            enabledBtn()
            return
        }

        const birth =
            `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

        if (currentProgress >= MAXPROGRESS) {
            navigation.navigate("CompanyInput", {
                username,
                birth,
                gender: formData.gender,
                startupType: formData.startupType
            })
        } else {
            setCurrentProgress(prev => prev + 1)
        }

        hideError()
        enabledBtn()
    }

    useEffect(() => {
        const handler = BackHandler.addEventListener(
            "hardwareBackPress",
            goBack
        )

        return () => handler.remove()
    }, [goBack])

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