import { useCallback, useState } from "react";
import StartupStatus from "../../../../constants/StartupStatus"
import { CompanyInputScreenProps } from "../../../../screens/CompanyInputScreen"
import { useError } from "../../../util/useError";
import { useDisabled } from "../../../util/useDisabled";
import { CompanyInputFormData } from "../../../../type/user/companyInput.type";
import { ShowToast, ToastType } from "../../../../util/ShowToast";
import { setProfile } from "../../../../api/user";

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

    const goBack = () => {
        hideError();
        if (currentProgress <= 1) navigation.goBack();
        else setCurrentProgress((prev) => prev - 1);
    };

    const goNext = async () => {
        disabledBtn()
        const companyName = formData.companyName.trim()
        const companyDescription = formData.companyDescription.trim()
        const numberOfEmployees = formData.numberOfEmployees.trim()
        const companyWebsite = formData.companyWebsite.trim()
        const annualRevenue = formData.annualRevenue.trim()
        const startupLocation = formData.startupLocation.trim()
        const startupFields = formData.startupFields

        if(!companyName){
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
                ShowToast("프로필 수정", "프로필 수정에 성공하셨습니다", ToastType.SUCCESS)
            } catch (error : any) {
                if(error.isAxiosError){
                    ShowToast("프로필 수정", "프로필 수정에 실패하셨습니다", ToastType.ERROR)
                    console.log(error.message)
                    return
                }
                ShowToast("프로필 수정", "알 수 없는 오류가 발생했습니다", ToastType.ERROR)
            }
        } else {
            setCurrentProgress(prev => prev + 1)
        }
        hideError();
        enabledBtn();
    }

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