import { create } from "zustand";
import { isAxiosError } from "axios";
import { getRecommendedNotices } from "../api/notice";
import { BeforeNoticeType, NoticeType } from "../type/notice/notice.type";
import { parseReceptionPeriod } from "../util/DateFormat";
import { useNoticeStore } from "./noticeStore";
import { useProfileStore } from "./profileStore";
import { ShowToast, ToastType } from "../util/ShowToast";
import { ErrorResponse } from "../type/util/response.type";

type HomeState = {
    noticeItems: NoticeType[];
    recomLoading: boolean;
    fetchItems: () => Promise<void>;
    reset: () => void;
};

let activeRequestId = 0;

function mapRecommendedNotice(notice: BeforeNoticeType): NoticeType {
    const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
    return { ...notice, startDate, endDate };
}

function showRecommendedNoticeError(error: unknown) {
    if (isAxiosError(error)) {
        const response = error.response;
        if (!response) {
            ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
        } else {
            ShowToast("오류 발생", (response.data as ErrorResponse).message, ToastType.ERROR);
        }
        return;
    }

    ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
}

export const useHomeStore = create<HomeState>((set, get) => ({
    noticeItems: [],
    recomLoading: true,

    fetchItems: async () => {
        const requestId = activeRequestId + 1;
        activeRequestId = requestId;

        if (!get().recomLoading) {
            set({ recomLoading: true });
        }

        try {
            await useProfileStore.getState().fetchProfile();
            const notices = (await getRecommendedNotices()).data.map(mapRecommendedNotice);

            if (activeRequestId !== requestId) {
                return;
            }

            useNoticeStore.getState().setNotices(notices);
            set({ noticeItems: notices, recomLoading: false });
        } catch (error: unknown) {
            if (activeRequestId === requestId) {
                showRecommendedNoticeError(error);
                set({ recomLoading: false });
            }
        }
    },

    reset: () => {
        activeRequestId += 1;
        set({ recomLoading: false });
    },
}));
