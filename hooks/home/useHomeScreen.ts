import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { getNotice, getNotices } from "../../api/notice";
import { useCallback, useState } from "react";
import { BeforeNoticeType, GetNoticesResponse, NoticeType } from "../../type/notice/notice.type";
import { ErrorResponse } from "../../type/util/response.type";
import { Linking, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native"
import type { HomeScreenProps } from "../../screens/Home/HomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import { getScheduleList, saveScheduleList } from "../../util/Schedule";

const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const [noticeItems, setNoticeItems] = useState<NoticeType[]>([]);
    const [bookmarkItems, setBookmarkItems] = useState<NoticeType[]>([]);
    const {width} = useWindowDimensions()
    const carouselHeight = 160
    const [carouselList, setCarouselList] = useState<NoticeType[]>([])
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
            value : '사업화',
            noticeType : NoticeCategory.BUSINESS,
            backgroundColor : '#E5ECFF',
            iconColor : '#709DFF'
        },
        {
            label : 'R&D',
            value : '기술개발',
            noticeType : NoticeCategory.RND,
            backgroundColor : '#EBE3FF',
            iconColor : '#D176FF'
        },
        {
            label : '시설',
            value : '시설',
            noticeType : NoticeCategory.FACILITY,
            backgroundColor : '#FFEAEA',
            iconColor : '#FF7F7F'
        },
        {
            label : '교육',
            value : '교육',
            noticeType : NoticeCategory.EDUCATION,
            backgroundColor : '#E3F5FF',
            iconColor : '#37B6FF'
        },
        {
            label : '글로벌',
            value : '글로벌',
            noticeType : NoticeCategory.GLOBAL,
            backgroundColor : '#E7FFE1',
            iconColor : '#92E4A8'
        },
        {
            label : '인력',
            value : '인력',
            noticeType : NoticeCategory.TALENT,
            backgroundColor : '#FFF2DF',
            iconColor : '#FFBE62'
        },
        {
            label : '행사',
            value : '행사',
            noticeType : NoticeCategory.EVENT,
            backgroundColor : '#FFE6F3',
            iconColor : '#FF7FB8'
        },
        {
            label : '자금',
            value : '자금',
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
            const noticeList : GetNoticesResponse = await getNotices("", "", "", "", "", 0);
            
            const mapped = noticeList.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    startDate,
                    endDate,
                };
            });

            const bookmarkList = await getScheduleList()
            const resultBookmarkList = await Promise.all(bookmarkList.map(async value => {
                const result = (await getNotice(value)).data
                const {startDate, endDate} = parseReceptionPeriod(result.receptionPeriod)
                return {
                    ...result,
                    startDate,
                    endDate
                }
            }))

            setNoticeItems(mapped);
            setBookmarkItems(resultBookmarkList);
            setCarouselList(mapped.splice(0, 3))

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
        navigation.navigate("Notice", { supportField });
    }

    function goInNotice(index : number) {
        navigation.navigate("InNotice", { Notice : carouselList[index]});
    }

    useFocusEffect(
        useCallback(() => {
            fetchNoticeItems();
        }, [])
    );

    return {
        form : {
            noticeItems,
            bookmarkItems,
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
            goNotice,
            goInNotice
        }
    }
}

export default useHomeScreen