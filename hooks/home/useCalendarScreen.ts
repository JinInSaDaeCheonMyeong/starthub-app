import { useCallback, useEffect, useState } from "react";
import { NoticeType } from "../../type/notice/notice.type";
import { buildDeadlineMarks, MarkedDates } from "../../util/MarkedDates";
import { useFocusEffect } from "@react-navigation/native"
import { ShowToast, ToastType } from "../../util/ShowToast";
import { useWindowDimensions } from "react-native";
import { formatToDate, parseReceptionPeriod } from "../../util/DateFormat";
import { getDateSchedules, getMonthSchedules } from "../../api/schedule";
import { useNoticeStore } from "../../store/noticeStore";

const useCalendarScreen = () => {
    const {width} = useWindowDimensions()
    const today = new Date()
    const todayString = formatToDate(today, 'solid');
    const [currentDate, setCurrentDate] = useState(todayString)
    const [viewingMonth, setViewingMonth] = useState(todayString.substring(0, 7))
    const [loading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({})
    const [noticeItemList, setNoticeItemList] = useState<NoticeType[]>([]);
    const setNotices = useNoticeStore((state) => state.setNotices);

    const getNoticeItem = async (date: string): Promise<NoticeType[]> => {
        try {
            setLoading(true);
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
            setNotices(resolvedNotices);
            setNoticeItemList(resolvedNotices);
    
            return resolvedNotices;
        } catch (error) {
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const initMarkedDates = async () => {
        try {
            const schedules = await getMonthSchedules(viewingMonth + '-01');
            const dates = buildDeadlineMarks(schedules.data);
            setMarkedDates(dates);
        } catch (error) {
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR)
        }
    }

    useEffect(() => {
        initMarkedDates()
    }, [viewingMonth])

    useFocusEffect(
        useCallback(() => {
            initMarkedDates(); 
            getNoticeItem(currentDate);
        }, [currentDate])
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
