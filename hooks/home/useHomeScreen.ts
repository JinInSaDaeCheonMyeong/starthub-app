import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"
import type { HomeScreenProps } from "../../screens/Home/HomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import { useProfileStore } from "../../store/profileStore";
import { useHomeStore } from "../../store/homeStore";

export const noticeCategoryList = [
    { label: '사업화', value: '사업화', noticeType: NoticeCategory.BUSINESS },
    { label: 'R&D', value: '기술개발', noticeType: NoticeCategory.RND },
    { label: '시설', value: '시설', noticeType: NoticeCategory.FACILITY },
    { label: '교육', value: '교육', noticeType: NoticeCategory.EDUCATION },
    { label: '글로벌', value: '글로벌', noticeType: NoticeCategory.GLOBAL },
    { label: '인력', value: '인력', noticeType: NoticeCategory.TALENT },
    { label: '행사', value: '행사', noticeType: NoticeCategory.EVENT },
    { label: '자금', value: '자금', noticeType: NoticeCategory.FUNDING },
];

export const navItemList: { label: string; nav: 'Competitor' | 'MyLikes' | 'ChatBot' | 'Alarm' }[] = [
    { label: "경쟁사 분석", nav: "Competitor" },
    { label: "내 북마크", nav: "MyLikes" },
    { label: "Hub AI", nav: "ChatBot" },
    { label: "내 알림", nav: "Alarm" },
];

const useHomeScreen = ({navigation} : HomeScreenProps) => {
    const noticeItems = useHomeStore((state) => state.noticeItems);
    const recomLoading = useHomeStore((state) => state.recomLoading);
    const fetchItems = useHomeStore((state) => state.fetchItems);
    const resetHome = useHomeStore((state) => state.reset);
    const userName = useProfileStore((state) => state.profileData?.username ?? '');

    const goNotice = useCallback((supportField: string) => {
        navigation.navigate("NoticeSearch", { supportField });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            fetchItems();
            return resetHome;
        }, [fetchItems, resetHome])
    );

    return {
        noticeItems,
        recomLoading,
        userName,
        goNotice,
    }
}

export default useHomeScreen
