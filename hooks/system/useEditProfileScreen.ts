import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ProfileScreenProps } from "../../screens/system/EditProfileScreen"
import { setProfile } from "../../api/user"
import { ShowToast, ToastType } from "../../util/ShowToast"

const useEditProfileScreen = ({navigation, route : {params}} : ProfileScreenProps) => {
    const birthList = params.birth.split('-')
    const insets = useSafeAreaInsets()
    const [user, setUser] = useState(params)
    const [year, setYear] = useState(birthList[0] ?? 1000)
    const [month, setMonth] = useState(birthList[1] ?? 11)
    const [day, setDay] = useState(birthList[2] ?? 11)
    const [numberPerson, setNumberPerson] = useState(String(user.numberOfEmployees) ?? '');
    const [annualRevenue, setAnnualRevenue] = useState(String(user.annualRevenue) ?? '');
    const [selectGender, setSelectGender] = useState(
        user.gender === "MALE" ? "male" :
            user.gender === "FEMALE" ? "female" :
                "none"
    )
    const [selectStartupStatus, setSelectStartupStatus] = useState(user.startupStatus === "EARLY_STAGE")

    const sendEditProfile = async () => {
        if(!user.username.trim() || !year.trim() || !month.trim() || !day.trim()){
            ShowToast(
                "프로필 수정",
                "필수 항목을 입력해주세요",
                ToastType.ERROR
            );
            return;
        }
        if(selectStartupStatus){
            if(!user.companyName?.trim() || !numberPerson.trim() || !annualRevenue.trim()){
                ShowToast(
                    "프로필 수정",
                    "필수 항목을 입력해주세요",
                    ToastType.ERROR
                );
                return;
            }
        }
        if (selectStartupStatus && !!user.companyWebsite) {
            // URL 검사식 (HTTP, HTTPS만 허용)
            const urlRegex =
                /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
                
            if (!urlRegex.test(user.companyWebsite.trim())) {
                ShowToast(
                    "프로필 수정",
                    "올바른 URL 형식이 아닙니다. (예: https://example.com)",
                    ToastType.ERROR
                );
                return;
            }
        }
        
        try {
            await setProfile({
                username: user.username.trim(),
                birth: `${year.trim()}-${month.trim()}-${day.trim()}`,
                gender: selectGender == "male"? "MALE" : selectGender == "female" ? "FEMALE": "OTHER",
                startupStatus: selectStartupStatus ? "EARLY_STAGE" : "PRE_STARTUP",
                companyName: selectStartupStatus ? user.companyName?.trim() : undefined,
                companyDescription: selectStartupStatus ? user.companyDescription?.trim() : undefined,
                numberOfEmployees: selectStartupStatus ? Number(numberPerson.trim()) : undefined,
                companyWebsite: selectStartupStatus ? user.companyWebsite?.trim() : undefined,
                annualRevenue: selectStartupStatus ? Number(annualRevenue.trim()) : undefined,
                startupLocation: user.startupLocation?.trim(),
                startupFields : params.startupFields,
                startupHistory : params.startupHistory ?? 0 // 창업 업력, 기존 design에는 없던 속성
            })
            ShowToast("프로필 수정", "프로필 수정에 성공했습니다", ToastType.SUCCESS)
            navigation.goBack()
        } catch (error : any) {
            if(error.isAxiosError){
                ShowToast("프로필 수정", "프로필 수정에 실패했습니다", ToastType.ERROR)
                console.log(error.message)
            }
            ShowToast("프로필 수정", "알 수 없는 오류가 발생했습니다", ToastType.ERROR)
        } 
    }

    const goBack = () => {
        navigation.goBack()
    }

    return {
        form : {
            user,
            year,
            month,
            day,
            numberPerson,
            annualRevenue,
            selectGender,
            selectStartupStatus,
            setUser,
            setYear,
            setMonth,
            setDay,
            setNumberPerson,
            setAnnualRevenue,
            setSelectGender,
            setSelectStartupStatus
        },
        ui : {
            insets
        },
        action : {
            goBack,
            sendEditProfile
        }
    }
}

export default useEditProfileScreen

