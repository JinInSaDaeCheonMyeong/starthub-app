import { useCallback, useState } from "react";
import StartupType from "../../../../constants/StartupType"
import { CompanyInputScreenProps } from "../../../../screens/CompanyInputScreen"
import { useError } from "../../../util/useError";
import { useDisabled } from "../../../util/useDisabled";
import { CompanyInputFormData } from "../../../../type/user/companyInput.type";

export const useCompanyInputScreen = (
    {
        navigation, 
        route : {
            params : {
                startupType,
            }
        }
    } : CompanyInputScreenProps,
    earlyScreenNumber : number,
    preScreenNumber : number
) => {
    const isEarlyStartup = startupType === StartupType.EARLY_STARTUP; 
    const MAXPROGRESS = isEarlyStartup ? earlyScreenNumber : preScreenNumber
    const [currentProgress, setCurrentProgress] = useState(1)
    const [formData, setFormData] = useState<CompanyInputFormData>({
        companyName: "",
        companyIntro: "",
        personNumber: "",
        companySite: "",
        getMoneyYear: "",
        earlyCompanyLocation: "",
        earlyInterestList: [],
        
        preCompanyLocation: "",
        preInterestList: [],
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
    const setCompanyIntro = makeSetter("companyIntro");
    const setPersonNumber = makeSetter("personNumber");
    const setCompanySite = makeSetter("companySite");
    const setGetMoneyYear = makeSetter("getMoneyYear");
    const setEarlyCompanyLocation = makeSetter("earlyCompanyLocation");
    const setEarlyInterestList = makeSetter("earlyInterestList");
    const setPreCompanyLocation = makeSetter("preCompanyLocation");
    const setPreInterestList = makeSetter("preInterestList");

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
            setCompanyIntro,
            setPersonNumber,
            setCompanySite,
            setGetMoneyYear,
            setEarlyCompanyLocation,
            setEarlyInterestList,
            setPreCompanyLocation,
            setPreInterestList
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