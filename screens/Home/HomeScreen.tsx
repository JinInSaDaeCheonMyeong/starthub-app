import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import { Fonts } from "../../constants/Fonts";
import { Colors } from "../../constants/Color";
import { CompositeScreenProps } from "@react-navigation/core";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";
import useHomeScreen, { navItemList, noticeCategoryList } from "../../hooks/home/useHomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import GlassView from "../../component/GlassView";
import * as Progress from "react-native-progress";
import { memo, useCallback, useMemo } from "react";
import { NoticeType } from "../../type/notice/notice.type";
import NoticeItem from "../../component/notice/NoticeItem";
import { NavImages, NoticeImages } from "../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";
import { Image } from 'expo-image';
import ListEmptyState from "../../component/ListEmptyState";

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get("window");
// 네비게이션 관련 이미지 매핑
const featureMap = {
    Competitor: NavImages.competitor,
    MyLikes: NavImages.compare,
    ChatBot: NavImages.suggestion,
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

const keyExtractor = (item: NoticeType) => item.id.toString();

const ItemSeparator = memo(function ItemSeparator() {
    return <View style={styles.separator} />;
});

function getTimeGreeting() {
    const hour = new Date().getHours();

    if (hour < 6) return "좋은 새벽이에요";
    if (hour < 12) return "좋은 아침이에요";
    if (hour < 18) return "좋은 오후예요";
    if (hour < 21) return "좋은 저녁이에요";
    return "좋은 밤이에요";
}

export default function HomeScreen(props: HomeScreenProps) {
    const {
        noticeItems,
        recomLoading,
        userName,
        goNotice,
    } = useHomeScreen(props);
    const renderPassName = recomLoading ? "loading" : `ready:${noticeItems.length}`;

    const renderNoticeItem = useCallback(
        (item: NoticeType) => (
            <NoticeItem
                item={item}
                onPress={() => props.navigation.navigate("InNotice", { Notice: item })}
            />
        ),
        [props.navigation]
    );

    const listHeader = useMemo(
        () => (
            <HomeListHeader
                userName={userName}
                goNotice={goNotice}
                navigate={props.navigation.navigate}
            />
        ),
        [goNotice, props.navigation.navigate, userName]
    );
    const listFooter = useMemo(
        () => recomLoading ? <HomeLoadingFooter /> : null,
        [recomLoading]
    );

    return (
        <FlashList
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal : 16 }}
            ItemSeparatorComponent={ItemSeparator}
            data={noticeItems}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => renderNoticeItem(item)}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            ListEmptyComponent={
                !recomLoading ? (
                    <ListEmptyState
                        message="추천 공고 항목이 없습니다."
                        style={styles.emptyState}
                    />
                ) : null
            }
        />
    );
}

type HomeListHeaderProps = {
    userName: string;
    goNotice: (supportField: string) => void;
    navigate: HomeScreenProps["navigation"]["navigate"];
};

const HomeListHeader = memo(function HomeListHeader({
    userName,
    goNotice,
    navigate,
}: HomeListHeaderProps) {
    const buttonSide = (width - 80) / 4;
    const greeting = getTimeGreeting();

    return (
        <>
            <View style={styles.bannerContainer}>
                <Text style={styles.mainText}>{`${greeting},\n${userName}님!`}</Text>
                <View style={styles.navIconContainer}>
                    {navItemList.map(({ label, nav }, index) => {
                        const IconComponent = featureMap[nav];
                        return (
                            <TouchableOpacity
                                onPress={() => navigate(nav)}
                                key={index}
                                style={styles.navIconWrapper}
                            >
                                {IconComponent && <Image style={styles.navImage} source={IconComponent} />}
                                <Text style={styles.navIconText}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

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
                                            style={styles.categoryImage}
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

            <View style={[styles.flatListWrapper, styles.recommendTitleWrapper]}>
                <View style={styles.textWrapper}>
                    <Text style={styles.titleText}>맞춤 추천 공고</Text>
                    <Text style={styles.captionText}>
                        {`${userName}님의 활동을 기반으로 좋아하실만한 공고를 추천해드려요.`}
                    </Text>
                </View>
            </View>
        </>
    );
});

const HomeLoadingFooter = memo(function HomeLoadingFooter() {
    return (
        <View style={styles.loadingContainer}>
            <Progress.Circle
                size={40}
                indeterminate
                color={Colors.primary}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    bannerContainer: { gap: 24, paddingTop : 20 },
    mainText: { fontFamily: Fonts.semiBold, color: Colors.black1, fontSize: 28 },
    navIconContainer: { flexDirection: "row", gap: 16},
    navIconWrapper: { alignItems: "center", gap: 4, flex : 1 },
    navImage: { width: 60, height: 60 },
    navIconText: {
        textAlign: "center",
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.black2,
    },
    flatListWrapper: { marginTop : 32, gap: 10, },
    recommendTitleWrapper: { marginBottom: 12 },
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
    categoryImage: { width: 50, height: 50 },
    iconLabel: { fontSize: 14, fontFamily: Fonts.medium, color: Colors.gray1 },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyState: {
        minHeight: 180,
    },
    separator: { height: 16 },
});
