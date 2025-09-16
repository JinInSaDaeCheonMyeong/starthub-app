import { useCallback, useState } from "react";
import StartupStatus from "../../../../constants/StartupStatus"
import { CompanyInputScreenProps } from "../../../../screens/CompanyInputScreen"
import { useError } from "../../../util/useError";
import { useDisabled } from "../../../util/useDisabled";
import { CompanyInputFormData } from "../../../../type/user/companyInput.type";

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
        handler: { hideError }
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