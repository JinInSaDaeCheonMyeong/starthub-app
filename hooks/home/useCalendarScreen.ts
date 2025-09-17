import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Colors } from "../../constants/Color";
import { useCallback, useRef, useState } from "react";
import { NoticeType } from "../../type/notice/notice.type";
import { buildDeadlineMarks, MarkedDates } from "../../util/MarkedDates";
import { useFocusEffect } from "@react-navigation/native"
import { getScheduleList } from "../../util/Schedule";
import { ShowToast, ToastType } from "../../util/ShowToast";

const useCalendarScreen = () => {
    const [day, setDay] = useState("");
    const [loading, setLoading] = useState(false);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({})
    const [noticeItemList, setNoticeItemList] = useState<NoticeType[]>([]);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const dotInfoList = [
        { color: Colors.info, text: "마감 4주전" },
        { color: Colors.warning, text: "마감 2주전" },
        { color: Colors.error, text: "마감 1주전" },
    ];
    const dayDataList = ["일", "월", "화", "수", "목", "금", "토"];

    const handleModalClose = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleModalOpen = useCallback(() => {
        bottomSheetModalRef.current?.present(0);
    }, []);

    const getNoticeItem = async (ids : number[]) : Promise<void> => {
        try {
            const storageList = await getScheduleList();
            const noticeItemList = ids
                .map((id) => storageList.find((item) => item.id === id))
                .filter((item): item is NoticeType => item !== undefined)
                .map((item) => ({
                    ...item,
                    startDate: typeof item.startDate === "string" ? new Date(item.startDate) : item.startDate,
                    endDate: typeof item.endDate === "string" ? new Date(item.endDate) : item.endDate,
                }));
            setNoticeItemList(noticeItemList);
        } catch (error) {
            ShowToast("오류 발생", "일정을 불러올 수 없습니다", ToastType.ERROR)
        }
    };

    const initMarkedDates = async () => {
        try {
            const list = await getScheduleList();
            const dates = buildDeadlineMarks(list);
            setMarkedDates(dates);
        } catch (error) {
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
            day,
            loading,
            noticeItemList,
            getNoticeItem,
            setDay,
            setLoading,
        },
        ui : {
            dotInfoList,
            dayDataList,
            markedDates,
            bottomSheetModalRef
        },
        action : {
            handleModalClose,
            handleModalOpen
        }
    }
}

export default useCalendarScreen