import { useCallback, useEffect, useState } from "react";
import { NoticeType } from "../../type/notice/notice.type";
import { buildDeadlineMarks, MarkedDates } from "../../util/MarkedDates";
import { useFocusEffect } from "@react-navigation/native"
import { ShowToast, ToastType } from "../../util/ShowToast";
import { useWindowDimensions } from "react-native";
import { formatToDate } from "../../util/DateFormat";
import { getDateSchedules, getMonthSchedules } from "../../api/schedule";

const useCalendarScreen = () => {
    const {width} = useWindowDimensions()
    const today = new Date()
    const todayString = formatToDate(today, 'solid');
    const [currentDate, setCurrentDate] = useState(todayString)
    const [viewingMonth, setViewingMonth] = useState(todayString.substring(0, 7))
    const [loading, setLoading] = useState(false);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({})
    const [noticeItemList, setNoticeItemList] = useState<NoticeType[]>([]);

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

    const getNoticeItem = async (date: string): Promise<NoticeType[]> => {
        try {
            const noticeItems = (await getDateSchedules(date)).data.map((value) => {
                const { startDate, endDate } = parseReceptionPeriod(value.receptionPeriod);
                return {
                    ...value,
                    startDate,
                    endDate,
                };
            });
    
            const today = new Date(date);
    
            const sortedNotices = noticeItems.sort((a, b) => {
                const startA = new Date(a.startDate);
                const endA = new Date(a.endDate);
                const startB = new Date(b.startDate);
                const endB = new Date(b.endDate);
    
                const isTodayA =
                    startA.toDateString() === today.toDateString() &&
                    endA.toDateString() === today.toDateString();
                const isTodayB =
                    startB.toDateString() === today.toDateString() &&
                    endB.toDateString() === today.toDateString();
    
                if (isTodayA && !isTodayB) return -1;
                if (!isTodayA && isTodayB) return 1;
    
                return endA.getTime() - endB.getTime();
            });
            const resolvedNotices: NoticeType[] = sortedNotices;
            setNoticeItemList(resolvedNotices);
    
            return resolvedNotices;
        } catch (error) {
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR);
            return [];
        }
    };

    const initMarkedDates = async () => {
        try {
            const schedules = await getMonthSchedules(viewingMonth + '-01');
            console.log(viewingMonth + "-01");
            const dates = buildDeadlineMarks(schedules.data);
            setMarkedDates(dates);
        } catch (error) {
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR)
        }
    }

    // viewingMonth가 변경될 때 호출
    useEffect(() => {
        initMarkedDates()
    }, [viewingMonth])

    // 화면에 포커스될 때 마크와 일정 모두 리프레시
    useFocusEffect(
        useCallback(() => {
            initMarkedDates(); // 마크 리프레시
            getNoticeItem(currentDate); // 일정 리프레시
        }, [currentDate, viewingMonth]) // viewingMonth도 의존성에 추가
    );

    return {
        form : {
            loading,
            noticeItemList,
            currentDate,
            setLoading,
            setNoticeItemList,
            setViewingMonth,
            setCurrentDate,
            viewingMonth
        },
        ui : {
            markedDates,
            width,
            todayString
        },
        action : {
            getNoticeItem,
            initMarkedDates
        }
    }
}

export default useCalendarScreen