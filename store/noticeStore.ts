import { create } from "zustand";
import { deleteLikes, postLikes } from "../api/likes";
import { NoticeType } from "../type/notice/notice.type";

type NoticeState = {
  likedById: Record<number, boolean>;
  bookmarkLoadingById: Record<number, boolean>;
  scheduleByNoticeId: Record<number, boolean>;
  scheduleLoadingByNoticeId: Record<number, boolean>;
  setNotices: (notices: NoticeType[]) => void;
  setNoticeLiked: (noticeId: number, isLiked: boolean) => void;
  toggleNoticeLike: (noticeId: number, fallbackIsLiked: boolean) => Promise<boolean>;
  setScheduleStatus: (noticeId: number, isScheduled: boolean) => void;
  setScheduleLoading: (noticeId: number, loading: boolean) => void;
  clearNoticeState: () => void;
};

export const useNoticeStore = create<NoticeState>((set, get) => ({
  likedById: {},
  bookmarkLoadingById: {},
  scheduleByNoticeId: {},
  scheduleLoadingByNoticeId: {},

  setNotices: (notices) => {
    set((state) => {
      const likedById = { ...state.likedById };
      notices.forEach((notice) => {
        likedById[notice.id] = notice.isLiked;
      });
      return { likedById };
    });
  },

  setNoticeLiked: (noticeId, isLiked) => {
    set((state) => ({
      likedById: {
        ...state.likedById,
        [noticeId]: isLiked,
      },
    }));
  },

  toggleNoticeLike: async (noticeId, fallbackIsLiked) => {
    const current = get().likedById[noticeId] ?? fallbackIsLiked;

    set((state) => ({
      bookmarkLoadingById: {
        ...state.bookmarkLoadingById,
        [noticeId]: true,
      },
    }));

    try {
      if (current) {
        await deleteLikes(noticeId);
      } else {
        await postLikes(noticeId);
      }

      const next = !current;
      get().setNoticeLiked(noticeId, next);
      return next;
    } finally {
      set((state) => ({
        bookmarkLoadingById: {
          ...state.bookmarkLoadingById,
          [noticeId]: false,
        },
      }));
    }
  },

  setScheduleStatus: (noticeId, isScheduled) => {
    set((state) => ({
      scheduleByNoticeId: {
        ...state.scheduleByNoticeId,
        [noticeId]: isScheduled,
      },
    }));
  },

  setScheduleLoading: (noticeId, loading) => {
    set((state) => ({
      scheduleLoadingByNoticeId: {
        ...state.scheduleLoadingByNoticeId,
        [noticeId]: loading,
      },
    }));
  },

  clearNoticeState: () => {
    set({
      likedById: {},
      bookmarkLoadingById: {},
      scheduleByNoticeId: {},
      scheduleLoadingByNoticeId: {},
    });
  },
}));
