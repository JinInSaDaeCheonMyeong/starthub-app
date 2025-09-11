import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { notice } from "../../api/notice";
import { useCallback, useState } from "react";
import { NoticeItemType } from "../../type/notice/notice.type";
import { ErrorResponse } from "../../type/util/response.type";
import { Linking, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native"
import { HomeScreenProps } from "../../screens/Home/HomeScreen";
const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const [noticeItems, setNoticeItems] = useState<NoticeItemType[]>([]);
    const {width} = useWindowDimensions()
    const carouselHeight = 160
    const carouselData = [
        {
            title : "AI 디지털 전환 혁신 기업 해외실증 지원 사업 모집",
            peroid : "2025.04.02~2025.04.06",
        },
        {
            title : "AI 디지털 전환 혁신 기업 해외실증 지원 사업 모집",
            peroid : "2025.04.02~2025.04.06",
        },
        {
            title : "AI 디지털 전환 혁신 기업 해외실증 지원 사업 모집",
            peroid : "2025.04.02~2025.04.06",
        }
    ];
    const carouselMaxIndex = carouselData.length 

    const fetchNoticeItems = async () => {
        try {
        const response = await notice(1, "", "", "", "", "", "");
        setNoticeItems(response);
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

    function goWeb(link: string) {
        const handlePress = () => {
            Linking.openURL(link);
        }; handlePress()
    }

    useFocusEffect(
        useCallback(() => {
            fetchNoticeItems();
        }, [])
    );

    return {
        form : {
            noticeItems,
            carouselData,
            carouselMaxIndex
        },
        ui : {
            width,
            carouselHeight
        },
        actions : {
            goWeb
        }
    }
}

export default useHomeScreen