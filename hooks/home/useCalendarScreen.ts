import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Colors } from "../../constants/Color";
import { useCallback, useRef, useState } from "react";
import { NoticeType } from "../../type/notice/notice.type";
import { buildDeadlineMarks, MarkedDates } from "../../util/MarkedDates";
import { useFocusEffect } from "@react-navigation/native"
import { ShowToast, ToastType } from "../../util/ShowToast";
import { getNotice } from "../../api/notice";
import { useWindowDimensions } from "react-native";
import { formatToDate } from "../../util/DateFormat";
import { getDateSchedules, getMonthSchedules } from "../../api/schedule";
import { getScheduleList } from "../../util/Schedule";

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

    const getNoticeItem = async (date : string): Promise<NoticeType[]> => {
        try {
            const noticeItems = (await getDateSchedules(date)).data.map((value) => {
                const {startDate, endDate} = parseReceptionPeriod(value.receptionPeriod)
                return {
                    ...value,
                    startDate,
                    endDate
                }
            });

            const resolvedNotices : NoticeType[] = noticeItems;
            setNoticeItemList(resolvedNotices);

            return resolvedNotices;
        } catch (error) {
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR);
            return [];
        }
    };

    const initMarkedDates = async () => {
        try {
            setLoading(true)
            const schedules = await getMonthSchedules(currentDate);
            console.log(schedules)
            const dates = buildDeadlineMarks(schedules.data);
            setMarkedDates(dates);
            setLoading(false);
        } catch (error) {
            console.error(error)
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR)
        }
    }

    useFocusEffect(
        useCallback(() => {
            initMarkedDates()
        }, [])
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
        }
    }
}

export default useCalendarScreen