import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { getNotices } from "../../api/notice";
import { useCallback, useState } from "react";
import { BeforeNoticeType, GetNoticesResponse, NoticeType } from "../../type/notice/notice.type";
import { ErrorResponse } from "../../type/util/response.type";
import { Linking, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native"
import type { HomeScreenProps } from "../../screens/Home/HomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";

const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const [noticeItems, setNoticeItems] = useState<NoticeType[]>([]);
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

    const navList = [
        {
            icon : require("../../assets/images/analyzeNotice.png"),
            label : '경쟁사\n분석',
            navItem : 'Analyze'
        },
        {
            icon : require("../../assets/images/compareNotice.png"),
            label : '공고\n비교',
            navItem : 'Compare'
        },
        {
            icon : require("../../assets/images/suggestionAI.png"),
            label : 'AI 추천\n공고',
            navItem : 'Suggestion'
        },
        {
            icon : require("../../assets/images/calendar.png"),
            label : '달력\n보기',
            navItem : 'Calendar'
        }
    ]

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

    const parseReceptionPeriod = (period: string) => {
        try {
            if (!period || typeof period !== 'string') {
                console.warn('Invalid reception period:', period);
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            // "2025-09-01 ~ 2025-09-30 18:00" 형식에서 시간 제거하고 날짜만 추출
            const parts = period.split("~").map(str => str.trim());

            if (parts.length !== 2) {
                console.warn('Invalid period format - no ~ separator:', period);
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            const [startPart, endPart] = parts;

            // 시간 부분 완전히 제거하고 날짜만 추출
            // "2025-09-01" 또는 "2025-09-01 10:00" → "2025-09-01"
            const startDateStr = startPart.split(" ")[0];

            // "2025-09-30 18:00" 또는 "2025-09-30" → "2025-09-30"
            const endDateStr = endPart.split(" ")[0];

            // YYYY-MM-DD 형식인지 검증
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
                console.warn('Invalid date format:', { startDateStr, endDateStr, originalPeriod: period });
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            // Date 객체 생성 시 시간을 00:00:00으로 설정하여 날짜만 사용
            const startDate = new Date(startDateStr + 'T00:00:00');
            const endDate = new Date(endDateStr + 'T00:00:00');

            // 유효한 날짜인지 확인
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.warn('Invalid date created from:', {
                    startDateStr,
                    endDateStr,
                    originalPeriod: period
                });
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            return {
                startDate,
                endDate
            };
        } catch (error) {
            console.error('Error parsing reception period:', error, 'Period:', period);
            return {
                startDate: new Date(),
                endDate: new Date()
            };
        }
    };

    const fetchNoticeItems = async () => {
        try {
            const response: GetNoticesResponse = await getNotices("", "", "", "", "", 0);
            
            const mapped = response.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    startDate,
                    endDate,
                };
            });
            setNoticeItems(mapped);

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
            noticeCategoryList,
            navList
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