import React, { useCallback, useState, useMemo } from "react";
import {
    Dimensions,
    FlatList,
    Image,
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
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStack";
import GlassView from "../../component/GlassView";
import { useFocusEffect } from "@react-navigation/native";
import { getRecommendedNotices } from "../../api/notice";
import { GetRecommendedNoticeResponse, BeforeNoticeType, NoticeType } from "../../type/notice/notice.type";
import { NoticeCategory } from "../../constants/NoticeCategory";

export type NoticeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Notice">,
    StackScreenProps<RootStackParamList>
>;

export default function NoticeScreen({ navigation }: NoticeScreenProps) {
    const [loading, setLoading] = useState(false);
    const [recommends, setRecommends] = useState<NoticeType[]>([]);

    /** 공고 데이터 요청 */
    const fetchRecommendNotices = useCallback(async () => {
        setLoading(true);
        try {
            const response: GetRecommendedNoticeResponse = await getRecommendedNotices();
            const mapped = response.data.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return { ...notice, startDate, endDate };
            });
            setRecommends(mapped);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    /** 화면 진입 시 새로 불러오기 */
    useFocusEffect(
        useCallback(() => {
            fetchRecommendNotices();
        }, [fetchRecommendNotices])
    );

    /** 날짜 파싱 */
    const parseReceptionPeriod = (period: string) => {
        try {
            const [start, end] = period.split("~").map(p => p.trim());
            return {
                startDate: new Date(start),
                endDate: new Date(end),
            };
        } catch {
            return { startDate: new Date(), endDate: new Date() };
        }
    };

    const categoryMap = useMemo(
        () => ({
            [NoticeCategory.BUSINESS]: require("../../assets/images/notice/business.png"),
            [NoticeCategory.EDUCATION]: require("../../assets/images/notice/education.png"),
            [NoticeCategory.EVENT]: require("../../assets/images/notice/event.png"),
            [NoticeCategory.FACILITY]: require("../../assets/images/notice/facility.png"),
            [NoticeCategory.FUNDING]: require("../../assets/images/notice/funding.png"),
            [NoticeCategory.GLOBAL]: require("../../assets/images/notice/global.png"),
            [NoticeCategory.RND]: require("../../assets/images/notice/rnd.png"),
            [NoticeCategory.TALENT]: require("../../assets/images/notice/talent.png"),
        }),
        []
    );

    const noticeCategoryList = useMemo(
        () => [
            { label: "사업화", value: "사업화", noticeType: NoticeCategory.BUSINESS },
            { label: "R&D", value: "기술개발", noticeType: NoticeCategory.RND },
            { label: "시설", value: "시설", noticeType: NoticeCategory.FACILITY },
            { label: "교육", value: "교육", noticeType: NoticeCategory.EDUCATION },
            { label: "글로벌", value: "글로벌", noticeType: NoticeCategory.GLOBAL },
            { label: "인력", value: "인력", noticeType: NoticeCategory.TALENT },
            { label: "행사", value: "행사", noticeType: NoticeCategory.EVENT },
            { label: "자금", value: "자금", noticeType: NoticeCategory.FUNDING },
        ],
        []
    );

    const goNotice = useCallback((supportField?: string, text?: string) => {
        navigation.navigate("NoticeSearch", { text, supportField });
    }, [navigation]);

    /** 카테고리 렌더 (FlatList로 변경) */
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
        [categoryMap, goNotice]
    );

    useFocusEffect(
        useCallback(() => {
            return () => {
                setRecommends([])
            }
        }, [])
    )

    return (
        <FlatList
            data={recommends}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => String(item.id ?? index)}
            removeClippedSubviews
            initialNumToRender={5}
            maxToRenderPerBatch={6}
            windowSize={10}
            ListHeaderComponent={
                <>
                    <Text style={styles.titleText}>공고를{"\n"}검색해보세요</Text>
                    <View style={styles.searchBar}>
                        <SearchBar onPress={(text) => goNotice(undefined, text)} />
                    </View>

                    <Text style={styles.smallText}>카테고리별 공고를 확인해보세요!</Text>
                    <FlatList
                        data={noticeCategoryList}
                        keyExtractor={(item) => item.label}
                        renderItem={renderCategory}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryList}
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
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyContainerText}>추천 공고가 없습니다.</Text>
                    </View>
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
    emptyContainerText: { fontSize: 18, color: Colors.gray2, fontFamily: Fonts.medium },
});
