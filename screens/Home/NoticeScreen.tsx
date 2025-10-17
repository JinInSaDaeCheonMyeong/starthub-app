import {
    Dimensions,
    FlatList,
    ScrollView,
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
import BusinessIcon from "../../assets/icons/glass/notice/buisness.svg";
import EducationIcon from "../../assets/icons/glass/notice/education.svg";
import EventIcon from "../../assets/icons/glass/notice/event.svg";
import FacilityIcon from "../../assets/icons/glass/notice/facility.svg";
import FundingIcon from "../../assets/icons/glass/notice/funding.svg";
import GlobalIcon from "../../assets/icons/glass/notice/global.svg";
import RNDIcon from "../../assets/icons/glass/notice/rnd.svg";
import TalentIcon from "../../assets/icons/glass/notice/talent.svg";
import { NoticeCategory } from "../../constants/NoticeCategory";
import GlassView from "../../component/GlassView";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { GetRecommendedNoticeResponse, BeforeNoticeType, NoticeType } from "../../type/notice/notice.type";
import { getRecommendedNotices } from "../../api/notice";


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
            console.error("추천 공고 데이터 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    /** 화면 진입 시마다 새로 불러오기 */
    useFocusEffect(
        useCallback(() => {
            fetchRecommendNotices();
        }, [fetchRecommendNotices])
    );

    /** 날짜 파싱 함수 */
    const parseReceptionPeriod = (period: string) => {
        try {
            if (!period || typeof period !== "string") return { startDate: new Date(), endDate: new Date() };

            const parts = period.split("~").map(str => str.trim());
            if (parts.length !== 2) return { startDate: new Date(), endDate: new Date() };

            const [startPart, endPart] = parts;
            const startDateStr = startPart.split(" ")[0];
            const endDateStr = endPart.split(" ")[0];
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr))
                return { startDate: new Date(), endDate: new Date() };

            const startDate = new Date(startDateStr + "T00:00:00");
            const endDate = new Date(endDateStr + "T00:00:00");
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
                return { startDate: new Date(), endDate: new Date() };

            return { startDate, endDate };
        } catch {
            return { startDate: new Date(), endDate: new Date() };
        }
    };

    const categoryMap = {
        [NoticeCategory.BUSINESS]: BusinessIcon,
        [NoticeCategory.EDUCATION]: EducationIcon,
        [NoticeCategory.EVENT]: EventIcon,
        [NoticeCategory.FACILITY]: FacilityIcon,
        [NoticeCategory.FUNDING]: FundingIcon,
        [NoticeCategory.GLOBAL]: GlobalIcon,
        [NoticeCategory.RND]: RNDIcon,
        [NoticeCategory.TALENT]: TalentIcon,
    };

    const noticeCategoryList = [
        { label: "사업화", value: "사업화", noticeType: NoticeCategory.BUSINESS },
        { label: "R&D", value: "기술개발", noticeType: NoticeCategory.RND },
        { label: "시설", value: "시설", noticeType: NoticeCategory.FACILITY },
        { label: "교육", value: "교육", noticeType: NoticeCategory.EDUCATION },
        { label: "글로벌", value: "글로벌", noticeType: NoticeCategory.GLOBAL },
        { label: "인력", value: "인력", noticeType: NoticeCategory.TALENT },
        { label: "행사", value: "행사", noticeType: NoticeCategory.EVENT },
        { label: "자금", value: "자금", noticeType: NoticeCategory.FUNDING },
    ];

    function goNotice(supportField?: string, text? :string) {
        navigation.navigate("NoticeSearch", { text, supportField, });
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={recommends}
                keyExtractor={(item, index) => String(item.id ?? index)}
                ListHeaderComponent={
                    <>
                        <Text style={styles.titleText}>공고를{"\n"}검색해보세요</Text>

                        <View style={styles.searchBar}>
                            <SearchBar onPress={(text) => goNotice(undefined, text)} />
                        </View>

                        <Text style={styles.smallText}>카테고리별 공고를 확인해보세요!</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ paddingStart: 16 }} />
                            {noticeCategoryList.map(({ label, value, noticeType }, index) => {
                                const IconComponent = categoryMap[noticeType];
                                return (
                                    <TouchableOpacity
                                        onPress={() => goNotice(value, undefined)}
                                        key={index}
                                        style={{ width: 80, height: 100, marginEnd: 10 }}
                                    >
                                        <GlassView
                                            blurPercent={0.5}
                                            containerStyle={{
                                                width: 80,
                                                alignItems: "center",
                                                gap: 4,
                                                padding: 10,
                                                backgroundColor: "rgba(255, 255, 255, 0.5)",
                                            }}
                                        >
                                            {IconComponent && <IconComponent width={50} height={50} />}
                                            <Text>{label}</Text>
                                        </GlassView>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.recommendHeader}>
                            <Text style={styles.recommendTitle}>AI 추천 공고</Text>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.noticeItemContainer}>
                        <NoticeItem item={item} onPress={() => {
                            navigation.navigate('InNotice', {Notice : item})
                        }} />
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
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "column" },
    searchBar: { marginHorizontal: 16, marginTop: 21, marginBottom: 22, height: 40 },
    noticeItemContainer: { marginHorizontal: 16, marginTop: 10 },
    indicatorContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium,
    },
    titleText: {
        marginTop: 20,
        paddingStart: 16,
        fontSize: 28,
        fontFamily: Fonts.semiBold,
    },
    smallText: {
        paddingStart: 16,
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        paddingBottom: 12,
    },
    recommendHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
    },
    recommendTitle: { fontSize: 16, fontFamily: Fonts.semiBold },
    moreButton: { flexDirection: "row", alignItems: "center" },
    moreText: {
        fontSize: 12,
        paddingEnd: 7,
        fontFamily: Fonts.reqular,
        color: Colors.gray2,
    },
});