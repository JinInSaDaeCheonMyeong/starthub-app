import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { getMe } from "../../api/user";
import { GetMeResponse } from "../../type/user/user.type";
import { ErrorResponse } from "../../type/util/response.type";
import StartupStatus from "../../constants/StartupStatus";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { ProfileScreenProps } from "../../screens/system/ProfileScreen";

// SVG Icons
import NameIcon from "../../assets/icons/profile/name.svg";
import GenderIcon from "../../assets/icons/profile/gender.svg";
import BirthIcon from "../../assets/icons/profile/birth.svg";
import BackpackIcon from "../../assets/icons/profile/backpack.svg";
import CompanyIcon from "../../assets/icons/profile/company.svg";
import IntroduceIcon from "../../assets/icons/profile/introduce.svg";
import PeopleIcon from "../../assets/icons/profile/people.svg";
import LocationIcon from "../../assets/icons/profile/location.svg";
import SiteIcon from "../../assets/icons/profile/link.svg";
import MoneyIcon from "../../assets/icons/profile/money.svg";

const useProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const DEFAULT_DATA = "내용이 없습니다";

    const genderMap = new Map<string, string>([
        ["MALE", "남"],
        ["FEMALE", "여"],
    ]);

    const startupStatusMap = new Map<string, string>([
        ["EARLY_STAGE", "초기 창업"],
        ["PRE_STARTUP", "예비 창업"],
    ]);

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<GetMeResponse["data"]>({
        id: -1,
        username: DEFAULT_DATA,
        birth: DEFAULT_DATA,
        gender: DEFAULT_DATA,
        email: DEFAULT_DATA,
        startupStatus: StartupStatus.EARLY_STAGE,
        companyName: DEFAULT_DATA,
        companyDescription: DEFAULT_DATA,
        numberOfEmployees: -1,
        companyWebsite: DEFAULT_DATA,
        startupLocation: DEFAULT_DATA,
        annualRevenue: -1,
        startupFields: [],
        provider: "LOCAL",
    });

    const profileList = [
        {
            label: "이름",
            icon: <NameIcon width={15} />,
            data: profileData.username,
        },
        {
            label: "성별",
            icon: <GenderIcon width={15} />,
            data: genderMap.get(profileData.gender) ?? DEFAULT_DATA,
        },
        {
            label: "생년월일",
            icon: <BirthIcon width={15} />,
            data:
                profileData.birth && !isNaN(Date.parse(profileData.birth))
                    ? new Date(profileData.birth).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : DEFAULT_DATA,
        },
        {
            label: "창업 형태",
            icon: <BackpackIcon width={15} />,
            data: startupStatusMap.get(profileData.startupStatus) ?? DEFAULT_DATA,
        },
    ];
    const earlyStartupList = [
        {
            label: "기업명",
            icon: <CompanyIcon width={15} />,
            data:
                profileData?.companyName?.trim() === ""
                    ? DEFAULT_DATA
                    : profileData?.companyName ?? DEFAULT_DATA,
        },
        {
            label: "기업 소개",
            icon: <IntroduceIcon width={15} />,
            data:
                profileData?.companyDescription?.trim() === ""
                    ? DEFAULT_DATA
                    : profileData?.companyDescription ?? DEFAULT_DATA,
        },
        {
            label: "기업 인원",
            icon: <PeopleIcon width={15} />,
            data:
                profileData?.numberOfEmployees && profileData.numberOfEmployees >= 0
                    ? `${profileData.numberOfEmployees}명`
                    : DEFAULT_DATA,
        },
        {
            label: "기업 위치",
            icon: <LocationIcon width={15} />,
            data:
                profileData?.startupLocation?.trim() === ""
                    ? DEFAULT_DATA
                    : profileData?.startupLocation ?? DEFAULT_DATA,
        },
        {
            label: "기업 사이트",
            icon: <SiteIcon width={15} />,
            data:
                profileData?.companyWebsite?.trim() === ""
                    ? DEFAULT_DATA
                    : profileData?.companyWebsite ?? DEFAULT_DATA,
        },
        {
            label: "연간 매출액",
            icon: <MoneyIcon width={15} />,
            data:
                profileData?.annualRevenue && profileData.annualRevenue >= 0
                    ? `${profileData.annualRevenue.toLocaleString()}원`
                    : DEFAULT_DATA,
        },
    ];
    const preStartupList = [
        {
            label: "기업 위치",
            icon: <LocationIcon width={15} />,
            data:
                profileData?.startupLocation?.trim() === ""
                    ? DEFAULT_DATA
                    : profileData?.startupLocation ?? DEFAULT_DATA,
        },
    ];
    const getProfileData = async () => {
        try {
            const response = await getMe();
            setProfileData(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                    return;
                }
                const errorData = response.data as ErrorResponse;
                ShowToast("오류 발생", errorData.message, ToastType.ERROR);
                return;
            }
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        }
    };

    const isWebLink = (label: string) => {
        return (
            label === "기업 사이트" &&
            profileData.companyWebsite?.trim() !== "" &&
            profileData.companyWebsite !== DEFAULT_DATA
        );
    };

    const goWeb = (link: string) => {
        Alert.alert("링크 열기", "외부 사이트로 이동하시겠습니까?", [
            { text: "취소", style: "cancel" },
            { text: "이동", onPress: () => Linking.openURL(link) },
        ]);
    };

    const goBack = () => {
        navigation.goBack();
    };

    const goEditProfile = () => {
        navigation.navigate("EditProfile", { ...profileData });
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchData = async () => {
                setLoading(true);
                await getProfileData();
                if (isActive) setLoading(false);
            };

            fetchData();

            return () => {
                isActive = false;
            };
        }, [])
    );

    return {
        form: {
            loading,
            profileData,
        },
        ui: {
            profileList,
            earlyStartupList,
            preStartupList,
            isWebLink,
        },
        action: {
            goBack,
            goEditProfile,
            goWeb,
        },
    };
};

export default useProfileScreen;
