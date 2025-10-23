import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Fonts } from "../../constants/Fonts";
import { Colors } from "../../constants/Color";
import { CompositeScreenProps } from "@react-navigation/core";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStack";
import useHomeScreen from "../../hooks/home/useHomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import GlassView from "../../component/GlassView";
import * as Progress from "react-native-progress";
import { useCallback, useMemo } from "react";
import { NoticeType } from "../../type/notice/notice.type";
import NoticeItem from "../../component/notice/NoticeItem";
import { NavImages, NoticeImages } from "../../constants/AppImages";

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    StackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get("window");
// 네비게이션 관련 이미지 매핑
const featureMap = {
    Competitor: NavImages.competitor,
    MyLikes: NavImages.compare,
    NoticeSearch: NavImages.suggestion,
    Alarm: NavImages.calendar,
};

// 공고 카테고리 이미지 매핑
const categoryMap = {
    [NoticeCategory.BUSINESS]: NoticeImages.business,
    [NoticeCategory.EDUCATION]: NoticeImages.education,
    [NoticeCategory.EVENT]: NoticeImages.event,
    [NoticeCategory.FACILITY]: NoticeImages.facility,
    [NoticeCategory.FUNDING]: NoticeImages.funding,
    [NoticeCategory.GLOBAL]: NoticeImages.global,
    [NoticeCategory.RND]: NoticeImages.rnd,
    [NoticeCategory.TALENT]: NoticeImages.talent,
};

export default function HomeScreen(props: HomeScreenProps) {
    const {
        form: { noticeItems, noticeCategoryList, userName },
        ui: { navItemList, recomLoading },
        actions: { goNotice },
    } = useHomeScreen(props);

    const renderNoticeItem = useCallback(
        (item: NoticeType) => (
            <NoticeItem
                item={item}
                onPress={() => props.navigation.navigate("InNotice", { Notice: item })}
            />
        ),
        [props.navigation]
    );

    const listHeader = useMemo(() => {
        // 배너
        const banner = (
            <View style={styles.bannerContainer}>
                <Text style={styles.mainText}>{`좋은 아침이에요,\n${userName}님!`}</Text>
                <View style={styles.navIconContainer}>
                    {navItemList.map(({ label, nav }, index) => {
                        const IconComponent = featureMap[nav];
                        let screenName :
                        | keyof HomeStackParamList
                        | keyof RootStackParamList ;
                        switch (index) {
                            case 0:
                                screenName = "Competitor";
                                break;
                            case 1:
                                screenName = "MyLikes";
                                break;
                            case 2:
                                screenName = "NoticeSearch";
                                break;
                            case 3:
                                screenName = "Alarm";
                                break;
                            default:
                                screenName = "Competitor";
                                break;
                        }
                        return (
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate(screenName as never)}
                                key={index}
                                style={styles.navIconWrapper}
                            >
                                {IconComponent && <Image style={{width : 60, height : 60}} source={IconComponent} />}
                                <Text style={styles.navIconText}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );

        const categorySection = (
            <View style={styles.flatListWrapper}>
                <View style={styles.textWrapper}>
                    <Text style={styles.titleText}>지원 사업 공고</Text>
                    <Text style={styles.captionText}>
                        카테고리를 눌러 공고를 조회할 수 있어요
                    </Text>
                </View>
                <View style={styles.noticeItemListWrapper}>
                    {noticeCategoryList.map(({ label, value, noticeType }, index) => {
                        const IconComponent = categoryMap[noticeType];
                        const buttonSide = (width - 80) / 4;
                        return (
                            <TouchableOpacity
                                onPress={() => goNotice(value)}
                                key={index}
                                style={styles.iconWrapper}
                            >
                                <GlassView
                                    blurPercent={0.5}
                                    containerStyle={{
                                        width: buttonSide,
                                        alignItems: "center",
                                        gap: 4,
                                        padding: 10,
                                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    }}
                                >
                                    {IconComponent && (
                                        <Image
                                            style={{ width: 50, height: 50 }}
                                            source={IconComponent}
                                        />
                                    )}
                                    <Text style={styles.iconLabel}>{label}</Text>
                                </GlassView>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );

        // 추천 공고 제목
        const recommendedTitle = (
            <View style={styles.flatListWrapper}>
                <View style={styles.textWrapper}>
                    <Text style={styles.titleText}>맞춤 추천 공고</Text>
                    <Text style={styles.captionText}>
                        사용자님의 관심을 분석하여 제공해 드려요
                    </Text>
                </View>
            </View>
        );

        return (
            <>
                {banner}
                {categorySection}
                {recommendedTitle}
            </>
        );
    }, [userName, noticeCategoryList, navItemList, goNotice, props.navigation]);

    return (
        <FlatList
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingBottom: 16, paddingHorizontal : 16 }}
            data={noticeItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderNoticeItem(item)}
            ListHeaderComponent={() => listHeader}
            ListFooterComponent={
                recomLoading ? (
                    <View style={styles.loadingContainer}>
                        <Progress.Circle
                            size={40}
                            indeterminate
                            color={Colors.primary}
                        />
                    </View>
                ) : null
            }
        />
    );
}

const styles = StyleSheet.create({
    bannerContainer: { gap: 24, paddingTop : 20 },
    mainText: { fontFamily: Fonts.semiBold, color: Colors.black1, fontSize: 28 },
    navIconContainer: { flexDirection: "row", gap: 16},
    navIconWrapper: { alignItems: "center", gap: 4, flex : 1 },
    navIconText: {
        textAlign: "center",
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.black2,
    },
    flatListWrapper: { marginTop : 32, gap: 10, },
    textWrapper: { gap: 4 },
    titleText: { fontSize: 18, fontFamily: Fonts.semiBold, color: Colors.black2 },
    captionText: { fontSize: 14, fontFamily: Fonts.reqular, color: Colors.gray2 },
    noticeItemListWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 8,
    },
    iconWrapper: { alignItems: "center", gap: 6 },
    iconLabel: { fontSize: 14, fontFamily: Fonts.medium, color: Colors.gray1 },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
});
