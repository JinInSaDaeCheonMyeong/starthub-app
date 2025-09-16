import { useCallback, useState } from "react";
import { GetMeResponse } from "../../type/user/user.type";
import StartupStatus from "../../constants/StartupStatus";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { isAxiosError } from "axios";
import { getMe } from "../../api/user";
import { ErrorResponse } from "../../type/util/response.type";
import {useFocusEffect} from "@react-navigation/native"
import { ProfileScreenProps } from "../../screens/system/ProfileScreen";
import { Linking } from "react-native";

const useProfileScreen = ({navigation} : ProfileScreenProps) => {
    const DEFAULT_DATA = "내용을 불러올 수 없습니다";
    const genderMap = new Map<string, string>([['MALE', "남"], ["FEMALE", "여"]])
    const startupStatusMap = new Map<string, string>([
        ['EARLY_STAGE', '예비 창업'], 
        ['PRE_STARTUP', '초기 창업']
    ])
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<GetMeResponse["data"]>({
        id : -1, 
        username : DEFAULT_DATA,
        birth : DEFAULT_DATA,
        gender : DEFAULT_DATA,
        email : DEFAULT_DATA,
        startupStatus : StartupStatus.EARLY_STAGE,
        companyName : DEFAULT_DATA,
        companyDescription : DEFAULT_DATA,
        numberOfEmployees : -1,
        companyWebsite : DEFAULT_DATA,
        startupLocation : DEFAULT_DATA,
        annualRevenue : -1,
        startupFields : []
    })
    
    const profileList = [
        {label : '이름', data : profileData.username},
        {label : '성별', data : genderMap.get(profileData.gender) ?? DEFAULT_DATA},
        {label : '생년월일', data : 
            profileData.birth && !isNaN(Date.parse(profileData.birth)) 
                ? new Date(profileData.birth).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) 
                : DEFAULT_DATA
        },
        { label: "창업 형태", data: startupStatusMap.get(profileData.startupStatus) ?? DEFAULT_DATA }
    ] 

    const earlyStarupList = [
        { label: "기업명", data: profileData?.companyName?.trim() === "" ? DEFAULT_DATA : profileData?.companyName ?? DEFAULT_DATA },
        { label: "기업 소개", data: profileData?.companyDescription?.trim() === "" ? DEFAULT_DATA : profileData?.companyDescription ?? DEFAULT_DATA },
        { label: "기업 인원", data: profileData?.numberOfEmployees != null ? `${profileData.numberOfEmployees}명` : DEFAULT_DATA },
        { label: "기업 사이트", data: profileData?.companyWebsite?.trim() === "" ? DEFAULT_DATA : profileData?.companyWebsite ?? DEFAULT_DATA },
        { label: "연매출액", data: profileData?.annualRevenue != null ? `${profileData.annualRevenue}원` : DEFAULT_DATA },
        { label: "창업위치", data: profileData?.startupLocation?.trim() === "" ? DEFAULT_DATA : profileData?.startupLocation ?? DEFAULT_DATA },
    ];

    const preStarupList = [
        { label: "창업위치", data: profileData?.startupLocation?.trim() === "" ? DEFAULT_DATA : profileData?.startupLocation ?? DEFAULT_DATA },
    ]

    const getProfileData = async () => {
        try {
            const profileData = (await getMe()).data;
            console.log(JSON.stringify(profileData))
            setProfileData(profileData)
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                    navigation.goBack()
                    return; 
                }
                const errorData = response.data as ErrorResponse;
                ShowToast("오류 발생", errorData.message, ToastType.ERROR);
                navigation.goBack();
                return;
            }
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
            navigation.goBack();
        }
    }
    
    const isWebLink = (index : number) => {
        return (
            index === 3 &&
            profileData.companyWebsite?.trim() !== "" &&
            profileData.companyWebsite !== DEFAULT_DATA
        );
    }

    const goWeb = async (link : string) => {
        const canOpen = await Linking.canOpenURL(link);
        if (canOpen) Linking.openURL(link);
        else ShowToast("오류 발생", "찾을 수 없는 사이트입니다", ToastType.ERROR);

    }

    const goBack = () => {
        navigation.goBack()
    }

    const goEditProfile = () => {
        navigation.navigate("EditProfile", { ...profileData });
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await getProfileData();
                setLoading(false);
            };
            fetchData();
        }, [])
    );
    return {
        form : {
            profileData
        },
        ui : {
            profileList,
            earlyStarupList,
            preStarupList,
            isWebLink
        },
        action : {
            goBack,
            goEditProfile,
            goWeb
        }
    }
}

export default useProfileScreen