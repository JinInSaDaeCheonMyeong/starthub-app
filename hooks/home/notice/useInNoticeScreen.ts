import { Alert, Linking } from "react-native";
import { useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { getDateSchedules, registerSchedules, removeSchedules } from "../../../api/schedule";
import { RootStackParamList } from "../../../navigation/RootStack";
import { useNoticeStore } from "../../../store/noticeStore";
import { BaseScheduleType } from "../../../type/schedules/schedules.type";
import { ErrorResponse } from "../../../type/util/response.type";
import { formatToDate } from "../../../util/DateFormat";
import { cleanNoticeContent } from "../../../util/noticeHtml";
import { ShowToast, ToastType } from "../../../util/ShowToast";

type InNoticeParams = RootStackParamList["InNotice"];

function isValidDate(date: Date) {
    return !Number.isNaN(date.getTime());
}

function formatDisplayDate(date: Date) {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export default function useInNoticeScreen(params: InNoticeParams) {
    const notice = params.Notice;
    const hasValidDateRange = isValidDate(notice.startDate) && isValidDate(notice.endDate);
    const targetAge = notice.targetAge === "전체" ? "전체연령" : notice.targetAge;
    const startupHistory = notice.startupHistory === "전체" ? "업력상관없음" : notice.startupHistory;

    const source = useMemo(
        () => ({ html: cleanNoticeContent(notice.content) }),
        [notice.content]
    );

    const periodLabel = hasValidDateRange
        ? `${formatDisplayDate(notice.startDate)}~${formatDisplayDate(notice.endDate)}`
        : notice.receptionPeriod || "모집 기간 정보 없음";

    const isSelected = useNoticeStore((state) => state.likedById[notice.id] ?? notice.isLiked);
    const isBookmarkLoading = useNoticeStore((state) => state.bookmarkLoadingById[notice.id] ?? false);
    const isSchedules = useNoticeStore((state) => state.scheduleByNoticeId[notice.id] ?? false);
    const isScheduleLoading = useNoticeStore((state) => state.scheduleLoadingByNoticeId[notice.id] ?? true);
    const toggleNoticeLike = useNoticeStore((state) => state.toggleNoticeLike);
    const setScheduleStatus = useNoticeStore((state) => state.setScheduleStatus);
    const setScheduleLoading = useNoticeStore((state) => state.setScheduleLoading);

    const handleBookmarkToggle = useCallback(async () => {
        if (isBookmarkLoading) return;

        try {
            const newIsLiked = await toggleNoticeLike(notice.id, notice.isLiked);
            params.onGoBack?.(notice.id, newIsLiked);
        } catch {
            ShowToast("오류 발생", "북마크 처리 중 오류가 발생했습니다", ToastType.ERROR);
        }
    }, [isBookmarkLoading, notice.id, notice.isLiked, params, toggleNoticeLike]);

    const handleSaveSchedules = useCallback(async () => {
        if (isScheduleLoading) return;
        if (!hasValidDateRange) {
            ShowToast("추가 불가", "상시 접수 공고는 일정을 추가할 수 없습니다", ToastType.ERROR);
            return;
        }

        setScheduleLoading(notice.id, true);

        try {
            if (isSchedules) {
                await removeSchedules(notice.id);
                setScheduleStatus(notice.id, false);
                ShowToast("삭제 성공", "일정을 삭제했습니다", ToastType.SUCCESS);
                return;
            }

            const data: BaseScheduleType = {
                announcementId: notice.id,
                startDate: formatToDate(notice.startDate, "solid"),
                endDate: formatToDate(notice.endDate, "solid"),
            };

            await registerSchedules(data);
            setScheduleStatus(notice.id, true);
            ShowToast("추가 성공", "일정을 추가했습니다", ToastType.SUCCESS);
        } catch {
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        } finally {
            setScheduleLoading(notice.id, false);
        }
    }, [
        hasValidDateRange,
        isScheduleLoading,
        isSchedules,
        notice.endDate,
        notice.id,
        notice.startDate,
        setScheduleLoading,
        setScheduleStatus,
    ]);

    const handleOpenURL = useCallback((url: string) => {
        Alert.alert(
            "링크 열기",
            "외부 사이트로 이동하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "이동",
                    onPress: () => Linking.openURL(url).catch(() =>
                        ShowToast("오류 발생", "링크를 열 수 없습니다", ToastType.ERROR)
                    ),
                },
            ]
        );
    }, []);

    const fetchIsSchedule = useCallback(async () => {
        setScheduleLoading(notice.id, true);
        try {
            const exists = (await getDateSchedules(formatToDate(new Date(), "solid")))
                .data
                .some((value) => value.id === notice.id);

            setScheduleStatus(notice.id, exists);
        } catch (error) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                    return;
                }
                const data = response.data as ErrorResponse;
                ShowToast("오류 발생", data.message, ToastType.ERROR);
                return;
            }
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        } finally {
            setScheduleLoading(notice.id, false);
        }
    }, [notice.id, setScheduleLoading, setScheduleStatus]);

    useFocusEffect(
        useCallback(() => {
            fetchIsSchedule();
        }, [fetchIsSchedule])
    );

    return {
        notice,
        source,
        meta: {
            periodLabel,
            targetAge,
            startupHistory,
        },
        ui: {
            isSelected,
            isBookmarkLoading,
            isSchedules,
            isScheduleLoading,
        },
        actions: {
            handleBookmarkToggle,
            handleSaveSchedules,
            handleOpenURL,
        },
    };
}
