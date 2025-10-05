import { useCallback, useEffect, useState } from "react";
import StartupStatus from "../../../../constants/StartupStatus"
import { CompanyInputScreenProps } from "../../../../screens/CompanyInputScreen"
import { useError } from "../../../util/useError";
import { useDisabled } from "../../../util/useDisabled";
import { CompanyInputFormData } from "../../../../type/user/companyInput.type";
import { ShowToast, ToastType } from "../../../../util/ShowToast";
import { setProfile } from "../../../../api/user";
import { BackHandler } from "react-native";
import {useFocusEffect} from "@react-navigation/native"

export const useCompanyInputScreen = (
    {
        navigation, 
        route : {
            params : {
                username,
                birth,
                gender,
                startupType,
            }
        }
    } : CompanyInputScreenProps,
    earlyScreenNumber : number,
    preScreenNumber : number
) => {
    const isEarlyStartup = startupType === StartupStatus.EARLY_STAGE; 
    const MAXPROGRESS = isEarlyStartup ? earlyScreenNumber : preScreenNumber
    const [currentProgress, setCurrentProgress] = useState(1)
    const [formData, setFormData] = useState<CompanyInputFormData>({
        startupFields : [],
        companyName : '',
        companyDescription : '',
        numberOfEmployees : '',
        companyWebsite : '',
        startupLocation : '',
        annualRevenue : '',
    });

    const {
        value: { 
            errorVisible,
            errorText
        },
        handler: { showError, hideError }
    } = useError()
    const { disabled, disabledBtn, enabledBtn } = useDisabled()

    const updateFormData = useCallback(<K extends keyof CompanyInputFormData>(
        key: K,
        value: CompanyInputFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        if (errorVisible) hideError()
    }, [errorVisible, hideError])

    const makeSetter = useCallback(<K extends keyof CompanyInputFormData>(key: K) =>
        (value: CompanyInputFormData[K]) => updateFormData(key, value), [updateFormData])

    const setCompanyName = makeSetter("companyName");
    const setCompanyDescription = makeSetter("companyDescription");
    const setNumberOfEmployees = makeSetter("numberOfEmployees");
    const setCompanyWebsite = makeSetter("companyWebsite");
    const setAnnualRevenue = makeSetter("annualRevenue");
    const setStartupLocation = makeSetter("startupLocation");
    const setStartupFields = makeSetter("startupFields");

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

    const goNext = async () => {
        disabledBtn()
        const companyName = formData.companyName.trim()
        const companyDescription = formData.companyDescription.trim()
        const numberOfEmployees = formData.numberOfEmployees.trim()
        const companyWebsite = formData.companyWebsite.trim()
        const annualRevenue = formData.annualRevenue.trim()
        const startupLocation = formData.startupLocation.trim()
        const startupFields = formData.startupFields

        if(
            !companyName && 
            startupType === StartupStatus.EARLY_STAGE
        ){
            showError('기업명을 입력해주세요')
            enabledBtn();
            return
        } else if (
            !numberOfEmployees && 
            currentProgress === 2 && 
            startupType === StartupStatus.EARLY_STAGE
        ) {
            showError("총 인원 수를 입력해주세요");
            enabledBtn();
            return;
        } else if(
            !!companyWebsite && 
            currentProgress === 2 && 
            startupType === StartupStatus.EARLY_STAGE
        ){
            // URL 검사식 (HTTP, HTTPS만 허용)
            const urlRegex =
                /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
                
            if (!urlRegex.test(companyWebsite.trim())) {
                showError(
                    '올바른 URL 형식이 아닙니다. (예: https://example.com)'
                );
                return;
            }
        } else if (
            !annualRevenue &&
            currentProgress === 3
        ) {
            showError("연간 매출액을 입력해주세요");
            enabledBtn();
            return;
        } else if (
            startupFields.length === 0
            && currentProgress === MAXPROGRESS
        ) {
            showError("창업 분야를 1개 이상 선택해주세요");
            enabledBtn();
            return;
        }

        if (currentProgress >= MAXPROGRESS) {
            console.log("마지막 단계 도착")
            try {
                await setProfile({
                    username,
                    birth,
                    gender,
                    startupStatus: startupType,
                    companyName,
                    companyDescription,
                    numberOfEmployees : Number(numberOfEmployees),
                    companyWebsite,
                    annualRevenue : Number(annualRevenue),
                    startupLocation,
                    startupFields
                })
                ShowToast("프로필 등록", "프로필 수정에 등록하셨습니다", ToastType.SUCCESS)
                navigation.navigate('HomeStack')
            } catch (error : any) {
                if(error.isAxiosError){
                    ShowToast("프로필 등록", "프로필 등록에 실패하셨습니다", ToastType.ERROR)
                    console.log(error.message)
                    return
                }
                ShowToast("프로필 등록", "알 수 없는 오류가 발생했습니다", ToastType.ERROR)
            } finally{
                hideError();
                enabledBtn();
            }
        } else {
            setCurrentProgress(prev => prev + 1)
        }
        hideError();
        enabledBtn();
    }

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', goBack)
            return () => {
                backHandler.remove()
            }
        }, [goBack])
    )

    return {
        form : {
            ...formData,
            setCompanyName,
            setCompanyDescription,
            setNumberOfEmployees,
            setCompanyWebsite,
            setAnnualRevenue,
            setStartupLocation,
            setStartupFields
        },
        ui : {
            MAXPROGRESS,
            currentProgress,
            isEarlyStartup,
            errorVisible,
            errorText,
            disabled
        },
        action : {
            goNext,
            goBack
        }
    }
}