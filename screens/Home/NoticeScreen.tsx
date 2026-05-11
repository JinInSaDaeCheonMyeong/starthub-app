import React, { useCallback, useState } from "react";
import { parseReceptionPeriod } from "../../util/DateFormat";
import { ShowToast, ToastType } from "../../util/ShowToast";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import SearchBar from "../../component/home/SearchBar";
import { Colors } from "../../constants/Color";
import NoticeItem from "../../component/notice/NoticeItem";
import * as Progress from "react-native-progress";
import { Fonts } from "../../constants/Fonts";
import { CompositeScreenProps } from "@react-navigation/core";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";
import GlassView from "../../component/GlassView";
import { useFocusEffect } from "@react-navigation/native";
import { getRecommendedNotices } from "../../api/notice";
import { GetRecommendedNoticeResponse, BeforeNoticeType, NoticeType } from "../../type/notice/notice.type";
import { NoticeCategory } from "../../constants/NoticeCategory";
import { NoticeImages } from "../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";
import { Image } from 'expo-image';
import { useNoticeStore } from "../../store/noticeStore";
import ListEmptyState from "../../component/ListEmptyState";


export type NoticeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Notice">,
    NativeStackScreenProps<RootStackParamList>
>;

const categoryMap = {
    [NoticeCategory.BUSINESS]: NoticeImages.business,
    [NoticeCategory.EDUCATION]: NoticeImages.education,
    [NoticeCategory.EVENT]: NoticeImages.event,
    [NoticeCategory.FACILITY]: NoticeImages.facility,
    [NoticeCategory.FUNDING]: NoticeImages.funding,
    [NoticeCategory.GLOBAL]: NoticeImages.global,
    [NoticeCategory.RND]: NoticeImages.rnd,
    [NoticeCategory.TALENT]: NoticeImages.talent,
} as const

const noticeCategoryList = [
    { label: "사업화", value: "사업화", noticeType: NoticeCategory.BUSINESS },
    { label: "R&D", value: "기술개발", noticeType: NoticeCategory.RND },
    { label: "시설", value: "시설", noticeType: NoticeCategory.FACILITY },
    { label: "교육", value: "교육", noticeType: NoticeCategory.EDUCATION },
    { label: "글로벌", value: "글로벌", noticeType: NoticeCategory.GLOBAL },
    { label: "인력", value: "인력", noticeType: NoticeCategory.TALENT },
    { label: "행사", value: "행사", noticeType: NoticeCategory.EVENT },
    { label: "자금", value: "자금", noticeType: NoticeCategory.FUNDING },
]

export default function NoticeScreen({ navigation }: NoticeScreenProps) {
    const [loading, setLoading] = useState(false);
    const [recommends, setRecommends] = useState<NoticeType[]>([]);
    const setNotices = useNoticeStore((state) => state.setNotices);

    /** 공고 데이터 요청 */
    const fetchRecommendNotices = useCallback(async () => {
        setLoading(true);
        try {
            const response: GetRecommendedNoticeResponse = await getRecommendedNotices();
            const mapped = response.data.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return { ...notice, startDate, endDate };
            });
            setNotices(mapped);
            setRecommends(mapped);
        } catch {
            ShowToast('오류 발생', '공고를 불러올 수 없습니다', ToastType.ERROR);
        } finally {
            setLoading(false);
        }
    }, [setNotices]);

    const goNotice = useCallback((supportField?: string, text?: string) => {
        navigation.navigate("NoticeSearch", { text, supportField });
    }, [navigation]);

    const renderCategory = useCallback(
        ({ item }: { item: (typeof noticeCategoryList)[0] }) => (
            <TouchableOpacity onPress={() => goNotice(item.value)}>
                <GlassView
                    blurPercent={0.4}
                    containerStyle={styles.categoryCard}
                >
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={categoryMap[item.noticeType]}
                    />
                    <Text>{item.label}</Text>
                </GlassView>
            </TouchableOpacity>
        ),
        [goNotice]
    );
    
    useFocusEffect(
        useCallback(() => {
            fetchRecommendNotices();
            return () => setRecommends([]);
        }, [fetchRecommendNotices])
    );

    return (
        <FlashList
            data={recommends}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => String(item.id ?? index)}
            removeClippedSubviews
            ListHeaderComponent={
                <>
                    <Text style={styles.titleText}>공고를{"\n"}검색해보세요</Text>
                    <View style={styles.searchBar}>
                        <SearchBar onPress={(text) => goNotice(undefined, text)} />
                    </View>

                    <Text style={styles.smallText}>카테고리별 공고를 확인해보세요!</Text>
                    <FlashList
                        ItemSeparatorComponent={() => <View style={{ width: 13 }} />}
                        data={noticeCategoryList}
                        keyExtractor={(item) => item.label}
                        renderItem={renderCategory}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryList}
                        ListEmptyComponent={
                            <ListEmptyState
                                message="카테고리 항목이 없습니다."
                                style={styles.horizontalEmptyContainer}
                                textStyle={styles.horizontalEmptyText}
                            />
                        }
                    />

                    <View style={styles.recommendHeader}>
                        <Text style={styles.recommendTitle}>AI 추천 공고</Text>
                    </View>
                </>
            }
            renderItem={({ item }) => (
                <View style={styles.noticeItemContainer}>
                    <NoticeItem
                        item={item}
                        onPress={() => navigation.navigate("InNotice", { Notice: item })}
                    />
                </View>
            )}
            ListFooterComponent={
                loading ? (
                    <View style={styles.loadingContainer}>
                        <Progress.Circle size={40} indeterminate color={Colors.primary} />
                    </View>
                ) : null
            }
            ListEmptyComponent={
                !loading ? (
                    <ListEmptyState message="추천 공고 항목이 없습니다." style={styles.emptyContainer} />
                ) : null
            }
            contentContainerStyle={{ paddingBottom: 16 }}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchBar: { marginHorizontal: 16, marginTop: 21, marginBottom: 22 },
    noticeItemContainer: { marginHorizontal: 16, marginTop: 10 },
    titleText: { marginTop: 20, paddingStart: 16, fontSize: 28, fontFamily: Fonts.semiBold },
    smallText: { paddingStart: 16, fontSize: 16, fontFamily: Fonts.semiBold, paddingBottom: 12 },
    categoryList: { paddingHorizontal: 16, paddingBottom: 8, gap : 16 },
    categoryCard: {
        width: 80,
        alignItems: "center",
        gap: 4,
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    recommendHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 28,
        marginBottom: 12,
    },
    recommendTitle: { fontSize: 16, fontFamily: Fonts.semiBold },
    loadingContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
    emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
    horizontalEmptyContainer: { minHeight: 80, minWidth: 220 },
    horizontalEmptyText: { fontSize: 14 },
});
