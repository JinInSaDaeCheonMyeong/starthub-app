import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { notice } from "../../api/notice";
import { useCallback, useState } from "react";
import { NoticeItemType } from "../../type/notice/notice.type";
import { ErrorResponse } from "../../type/util/response.type";
import { Linking, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native"
import type { HomeScreenProps } from "../../screens/Home/HomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";

const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const [noticeItems, setNoticeItems] = useState<NoticeItemType[]>([]);
    const {width} = useWindowDimensions()
    const carouselHeight = 160
    const carouselList = [
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
    const carouselMaxIndex = carouselList.length 

    const noticeCategoryList = [
        {
            label : '사업화',
            noticeType : NoticeCategory.BUSINESS,
            backgroundColor : '#E5ECFF',
            iconColor : '#709DFF'
        },
        {
            label : 'R&D',
            noticeType : NoticeCategory.RND,
            backgroundColor : '#EBE3FF',
            iconColor : '#D176FF'
        },
        {
            label : '시설',
            noticeType : NoticeCategory.FACILITY,
            backgroundColor : '#FFEAEA',
            iconColor : '#FF7F7F'
        },
        {
            label : '교육',
            noticeType : NoticeCategory.EDUCATION,
            backgroundColor : '#E3F5FF',
            iconColor : '#37B6FF'
        },
        {
            label : '글로벌',
            noticeType : NoticeCategory.GLOBAL,
            backgroundColor : '#E7FFE1',
            iconColor : '#92E4A8'
        },
        {
            label : '인력',
            noticeType : NoticeCategory.TALENT,
            backgroundColor : '#FFF2DF',
            iconColor : '#FFBE62'
        },
        {
            label : '행사',
            noticeType : NoticeCategory.EVENT,
            backgroundColor : '#FFE6F3',
            iconColor : '#FF7FB8'
        },
        {
            label : '자금',
            noticeType : NoticeCategory.FUNDING,
            backgroundColor : '#FFFED7',
            iconColor : '#D8D378'
        }
    ]

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
            carouselList,
            carouselMaxIndex,
            noticeCategoryList
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