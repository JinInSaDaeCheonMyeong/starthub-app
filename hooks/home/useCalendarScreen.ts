import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Colors } from "../../constants/Color";
import { useCallback, useRef, useState } from "react";
import { NoticeItemType } from "../../type/notice/notice.type";
import { NoticeItemList } from "../../constants/NoticeItemList";
import { buildDeadlineMarks, MarkedDates } from "../../util/MarkedDates";
import { useFocusEffect } from "@react-navigation/native"
import { getScheduleList } from "../../util/Schedule";

const useCalendarScreen = () => {
    const [day, setDay] = useState("");
    const [loading, setLoading] = useState(false);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({})
    const [noticeItemList, setNoticeItemList] = useState<NoticeItemType[]>([]);

    const dotInfoList = [
        { color: Colors.info, text: "마감 4주전" },
        { color: Colors.warning, text: "마감 2주전" },
        { color: Colors.error, text: "마감 1주전" },
    ];
    const dayDataList = ["일", "월", "화", "수", "목", "금", "토"];

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handleModalClose = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleModalOpen = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const getNoticeItem = (ids: number[]) => {
        const noticeItemList = ids
            .map((id) => NoticeItemList.find((item) => item.id === id))
            .filter((item): item is NoticeItemType => item !== undefined);
        setNoticeItemList(noticeItemList);
    };

    const initMarkedDates = async () => {
        const list = await getScheduleList();
        const dates = buildDeadlineMarks(list);
        setMarkedDates(dates);
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