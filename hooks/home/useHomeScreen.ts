import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { getNotice, getNotices, getRecommendedNotices } from "../../api/notice";
import { useCallback, useState } from "react";
import { BeforeNoticeType, GetNoticesResponse, GetRecommendedNoticeResponse, NoticeType } from "../../type/notice/notice.type";
import { ErrorResponse } from "../../type/util/response.type";
import { Linking, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native"
import type { HomeScreenProps } from "../../screens/Home/HomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import { getScheduleList, saveScheduleList } from "../../util/Schedule";
import { getMe } from "../../api/user";

const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const [noticeItems, setNoticeItems] = useState<NoticeType[]>([]);
    const [bookmarkItems, setBookmarkItems] = useState<NoticeType[]>([]);
    const {width} = useWindowDimensions()
    const [userName, setUserName] = useState('')
    const [recomLoading, setRecomLoading] = useState(true)
    const [scheduleLoading, setScheduleLoading] = useState(true);

    const noticeCategoryList = [
        {
            label : '사업화',
            value : '사업화',
            noticeType : NoticeCategory.BUSINESS,
        },
        {
            label : 'R&D',
            value : '기술개발',
            noticeType : NoticeCategory.RND,
        },
        {
            label : '시설',
            value : '시설',
            noticeType : NoticeCategory.FACILITY,
        },
        {
            label : '교육',
            value : '교육',
            noticeType : NoticeCategory.EDUCATION,
        },
        {
            label : '글로벌',
            value : '글로벌',
            noticeType : NoticeCategory.GLOBAL,
        },
        {
            label : '인력',
            value : '인력',
            noticeType : NoticeCategory.TALENT,
        },
        {
            label : '행사',
            value : '행사',
            noticeType : NoticeCategory.EVENT,
        },
        {
            label : '자금',
            value : '자금',
            noticeType : NoticeCategory.FUNDING,
        }
    ]

    const navItemList : {label : string, nav : 'Competitor' | 'Compare' | 'Suggest' | 'Calendar'}[] = [
        {
            label: "경쟁사 분석",
            nav: "Competitor",
        },
        {
            label: "공고 비교",
            nav: "Compare",
        },
        {
            label: "AI 추천 공고",
            nav: "Suggest",
        },
        {
            label: "일정 추가",
            nav: "Calendar",
        },
    ];

    const parseReceptionPeriod = (period: string) => {
        try {
            if (!period || typeof period !== 'string') {
                console.warn('Invalid reception period:', period);
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }
            const parts = period.split("~").map(str => str.trim());
            if (parts.length !== 2) {
                console.warn('Invalid period format - no ~ separator:', period);
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }
            const [startPart, endPart] = parts;
            const startDateStr = startPart.split(" ")[0];
            const endDateStr = endPart.split(" ")[0];
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
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

    const fetchItems = async () => {
        setRecomLoading(true);
        setScheduleLoading(true);
        try {
            const name = await (await getMe()).data.username;
            setUserName(name);
            const noticeList : GetRecommendedNoticeResponse = await getRecommendedNotices();
            const mapped = noticeList.data.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    startDate,
                    endDate,
                };
            });
            setNoticeItems(mapped);
            setRecomLoading(false);
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

    function goNotice(supportField : string) {
        navigation.navigate("NoticeSearch", { supportField });
    }

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    return {
        form : {
            noticeItems,
            bookmarkItems,
            noticeCategoryList,
            userName
        },
        ui : {
            width,
            navItemList,
            recomLoading,
            scheduleLoading
        },
        actions : {
            goNotice,
        }
    }
}

export default useHomeScreen