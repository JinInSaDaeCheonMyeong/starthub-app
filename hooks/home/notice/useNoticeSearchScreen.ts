import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getNotices } from "../../../api/notice";
import { RootStackParamList } from "../../../navigation/RootStack";
import { BeforeNoticeType, GetNoticesResponse, NoticeType } from "../../../type/notice/notice.type";
import { parseReceptionPeriod } from "../../../util/DateFormat";
import { ShowToast, ToastType } from "../../../util/ShowToast";
import { useNoticeStore } from "../../../store/noticeStore";

type NoticeSearchParams = RootStackParamList["NoticeSearch"] | undefined;

function mapNotice(notice: BeforeNoticeType): NoticeType {
    const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
    return {
        ...notice,
        startDate,
        endDate,
    };
}

export default function useNoticeSearchScreen(params: NoticeSearchParams) {
    const [title, setTitle] = useState("");
    const [supportField, setSupportField] = useState("");
    const [supportFieldOpen, setSupportFieldOpen] = useState(false);
    const [region, setRegion] = useState("");
    const [regionOpen, setRegionOpen] = useState(false);
    const [targetAge, setTargetAge] = useState("");
    const [targetAgeOpen, setTargetAgeOpen] = useState(false);
    const [businessExperience, setBusinessExperience] = useState("");
    const [businessExperienceOpen, setBusinessExperienceOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [isNatural, setIsNatural] = useState(false);
    const [allNotices, setAllNotices] = useState<NoticeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLast, setIsLast] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFirst, setIsFirst] = useState(false);

    const lastRequestTime = useRef<number>(0);
    const isInitialMount = useRef(true);
    const setNotices = useNoticeStore((state) => state.setNotices);
    const setNoticeLiked = useNoticeStore((state) => state.setNoticeLiked);

    const dropDownMargin = [
        regionOpen,
        supportFieldOpen,
        targetAgeOpen,
        businessExperienceOpen,
    ].some(Boolean)
        ? 200
        : 16;

    const fetchNotices = useCallback(
        async (isRefresh = false) => {
            try {
                if (!isRefresh) {
                    setLoading(true);
                    setPage(0);
                } else {
                    setRefreshing(true);
                }

                let currentSupportField = supportField;
                let currentTitle = title;

                if (!isFirst) {
                    if (typeof params?.supportField === "string" && params.supportField !== supportField) {
                        currentSupportField = params.supportField;
                        setSupportField(params.supportField);
                    }
                    if (typeof params?.text === "string" && params.text !== title) {
                        currentTitle = params.text;
                        setTitle(params.text);
                    }
                    setIsFirst(true);
                }

                const response: GetNoticesResponse = await getNotices(
                    currentTitle,
                    currentSupportField,
                    region,
                    targetAge,
                    businessExperience,
                    0
                );
                const mapped = response.data.content.map(mapNotice);

                setIsLast(response.data.isLast);
                setIsNatural(response.data.content[0]?.isNatural ?? false);
                setNotices(mapped);
                setAllNotices(mapped);
            } catch {
                ShowToast(
                    "문제가 발생했습니다",
                    "데이터를 불러오지 못했습니다",
                    ToastType.ERROR
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            title,
            supportField,
            region,
            targetAge,
            businessExperience,
            params?.supportField,
            params?.text,
            isFirst,
            setNotices,
        ]
    );

    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        fetchNotices(false);
    }, [title, supportField, region, targetAge, businessExperience, fetchNotices]);

    useFocusEffect(
        useCallback(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            }
            fetchNotices(true);
            return () => {
                setAllNotices([]);
            };
        }, [fetchNotices])
    );

    useEffect(() => {
        if (params?.supportField && params.supportField !== supportField) {
            setSupportField(params.supportField);
        }
    }, [params?.supportField, supportField]);

    const loadNextPage = useCallback(async () => {
        const now = Date.now();

        if (now - lastRequestTime.current < 500) {
            return;
        }

        if (isFetchingNextPage || loading || isLast) return;

        lastRequestTime.current = now;
        const nextPage = page + 1;
        setIsFetchingNextPage(true);

        try {
            const response = await getNotices(
                title,
                supportField,
                region,
                targetAge,
                businessExperience,
                nextPage
            );
            const data = response.data.content.map(mapNotice);

            setIsLast(response.data.isLast);
            if (data.length > 0) {
                setPage(nextPage);
                setNotices(data);
                setAllNotices((prev) => [...prev, ...data]);
            }
        } catch {
            ShowToast(
                "문제가 발생했습니다",
                "데이터를 불러오지 못했습니다",
                ToastType.ERROR
            );
        } finally {
            setIsFetchingNextPage(false);
        }
    }, [
        isFetchingNextPage,
        loading,
        isLast,
        page,
        title,
        supportField,
        region,
        targetAge,
        businessExperience,
        setNotices,
    ]);

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (!viewableItems || viewableItems.length === 0 || allNotices.length === 0) return;

        const lastVisibleItem = viewableItems[viewableItems.length - 1];
        if (!lastVisibleItem) return;

        if (lastVisibleItem.index >= allNotices.length - 5 && !isLast) {
            loadNextPage();
        }
    }, [allNotices.length, isLast, loadNextPage]);

    const updateNoticeInList = useCallback(
        (noticeId: number, newIsLiked: boolean) => {
            setAllNotices((prevNotices) =>
                prevNotices.map((notice) =>
                    notice.id === noticeId ? { ...notice, isLiked: newIsLiked } : notice
                )
            );
            setNoticeLiked(noticeId, newIsLiked);
        },
        [setNoticeLiked]
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotices(true);
    }, [fetchNotices]);

    return {
        filters: {
            title,
            setTitle,
            supportField,
            setSupportField,
            supportFieldOpen,
            setSupportFieldOpen,
            region,
            setRegion,
            regionOpen,
            setRegionOpen,
            targetAge,
            setTargetAge,
            targetAgeOpen,
            setTargetAgeOpen,
            businessExperience,
            setBusinessExperience,
            businessExperienceOpen,
            setBusinessExperienceOpen,
        },
        data: {
            allNotices,
            loading,
            refreshing,
            isFetchingNextPage,
            isNatural,
        },
        ui: {
            dropDownMargin,
        },
        actions: {
            handleRefresh,
            onViewableItemsChanged,
            updateNoticeInList,
        },
    };
}
