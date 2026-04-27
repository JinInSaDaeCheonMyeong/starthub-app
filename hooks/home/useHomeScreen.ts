import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { getRecommendedNotices } from "../../api/notice";
import { useCallback, useState } from "react";
import { BeforeNoticeType, NoticeType } from "../../type/notice/notice.type";
import { ErrorResponse } from "../../type/util/response.type";
import { useFocusEffect } from "@react-navigation/native"
import type { HomeScreenProps } from "../../screens/Home/HomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import { parseReceptionPeriod } from "../../util/DateFormat";
import { useProfileStore } from "../../store/profileStore";
import { useNoticeStore } from "../../store/noticeStore";

const noticeCategoryList = [
    { label: '사업화', value: '사업화', noticeType: NoticeCategory.BUSINESS },
    { label: 'R&D', value: '기술개발', noticeType: NoticeCategory.RND },
    { label: '시설', value: '시설', noticeType: NoticeCategory.FACILITY },
    { label: '교육', value: '교육', noticeType: NoticeCategory.EDUCATION },
    { label: '글로벌', value: '글로벌', noticeType: NoticeCategory.GLOBAL },
    { label: '인력', value: '인력', noticeType: NoticeCategory.TALENT },
    { label: '행사', value: '행사', noticeType: NoticeCategory.EVENT },
    { label: '자금', value: '자금', noticeType: NoticeCategory.FUNDING },
];

const navItemList: { label: string; nav: 'Competitor' | 'MyLikes' | 'ChatBot' | 'Alarm' }[] = [
    { label: "경쟁사 분석", nav: "Competitor" },
    { label: "내 북마크", nav: "MyLikes" },
    { label: "Hub AI", nav: "ChatBot" },
    { label: "내 알림", nav: "Alarm" },
];

const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const [noticeItems, setNoticeItems] = useState<NoticeType[]>([]);
    const [recomLoading, setRecomLoading] = useState(true);
    const profileData = useProfileStore((state) => state.profileData);
    const fetchProfile = useProfileStore((state) => state.fetchProfile);
    const setNotices = useNoticeStore((state) => state.setNotices);

    const fetchItems = async () => {
        setRecomLoading(true);
        try {
            await fetchProfile();
            const notices = (await getRecommendedNotices()).data;
            const mapped = notices.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return { ...notice, startDate, endDate };
            });
            setNotices(mapped);
            setNoticeItems(mapped);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                } else {
                    ShowToast("오류 발생", (response.data as ErrorResponse).message, ToastType.ERROR);
                }
            } else {
                ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
            }
        } finally {
            setRecomLoading(false);
        }
    };

    const goNotice = useCallback((supportField: string) => {
        navigation.navigate("NoticeSearch", { supportField });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            fetchItems();
            return () => {
                setNoticeItems([]);
                setRecomLoading(true);
            };
        }, [fetchProfile, setNotices])
    );

    return {
        form : {
            noticeItems,
            noticeCategoryList,
            userName: profileData?.username ?? ''
        },
        ui : {
            navItemList,
            recomLoading,
        },
        actions : {
            goNotice,
        }
    }
}

export default useHomeScreen
