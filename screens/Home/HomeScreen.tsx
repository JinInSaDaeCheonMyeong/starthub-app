import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import NoticeItem from "../../component/notice/NoticeItem";
import { CompositeScreenProps } from "@react-navigation/core";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../../navigation/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import useHomeScreen from "../../hooks/home/useHomeScreen";
import { NoticeCategory } from "../../constants/NoticeCategory";
import BusinessIcon from "../../assets/icons/glass/notice/buisness.svg"
import EducationIcon from "../../assets/icons/glass/notice/education.svg"
import EventIcon from "../../assets/icons/glass/notice/event.svg"
import FacilityIcon from "../../assets/icons/glass/notice/facility.svg"
import FundingIcon from "../../assets/icons/glass/notice/funding.svg"
import GlobalIcon from "../../assets/icons/glass/notice/global.svg"
import RNDIcon from "../../assets/icons/glass/notice/rnd.svg"
import TalentIcon from "../../assets/icons/glass/notice/talent.svg"
import CompetitorIcon from "../../assets/icons/glass/home/competitor.svg"
import CompareIcon from "../../assets/icons/glass/home/compare.svg";
import SuggestionIcon from "../../assets/icons/glass/home/suggestion.svg";
import CalendarIcon from "../../assets/icons/glass/home/calendar.svg";
import GlassView from "../../component/GlassView";
import * as Progress from 'react-native-progress';

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    StackScreenProps<RootStackParamList>
>;


const {width} = Dimensions.get("window");

export default function HomeScreen(props : HomeScreenProps) {
    const featureMap = {
        ['Competitor'] : CompetitorIcon,
        ['Compare'] : CompareIcon,
        ['Suggest'] : SuggestionIcon,
        ['Calendar'] : CalendarIcon
    }

    const categoryMap = {
        [NoticeCategory.BUSINESS] : BusinessIcon,
        [NoticeCategory.EDUCATION] : EducationIcon,
        [NoticeCategory.EVENT] : EventIcon,
        [NoticeCategory.FACILITY] : FacilityIcon,
        [NoticeCategory.FUNDING] : FundingIcon,
        [NoticeCategory.GLOBAL] : GlobalIcon,
        [NoticeCategory.RND] : RNDIcon,
        [NoticeCategory.TALENT] : TalentIcon
    }

    const {
        form : {
            noticeItems,
            bookmarkItems,
            noticeCategoryList,
            userName
        },
        ui : {
            navItemList,
            recomLoading,
            scheduleLoading
        },
        actions : {
            goNotice,
        }
    } = useHomeScreen(props)

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.flatListContainer}>
                <View style={styles.bannerContainer}> 
                    <Text style={styles.mainText}>
                        {`좋은 아침이에요,\n${userName}님!`}
                    </Text>
                    <View style={styles.navIconContainer}>
                        {
                            navItemList.map(({label, nav}, index) => {
                                const IconComponent = featureMap[nav];
                                let screenName :
                                    | keyof HomeStackParamList
                                    | keyof RootStackParamList = "Competitor";
                                switch (index) {
                                    case 0:
                                        screenName = "Competitor";
                                        break;
                                    default:
                                        screenName = "Competitor";
                                        break;
                                    }
                                return (
                                    <TouchableOpacity 
                                        onPress={() => {props.navigation.navigate(screenName)}}
                                        key={index}
                                        style={styles.navIconWrapper}
                                    >
                                        {IconComponent && <IconComponent width={60} height={60}/>}
                                        <Text style={styles.navIconText}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>지원 사업 공고</Text>
                        <Text style={styles.captionText}>카테고리를 눌러 공고를 조회할 수 있어요</Text>
                    </View>
                    <View style={styles.noticeItemListWrapper}>
                        {noticeCategoryList.map(({
                            label, 
                            value,
                            noticeType,
                        }, index) => {
                            const IconComponent = categoryMap[noticeType];
                            const buttonSide = (width-80)/4
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                    goNotice(value);
                                    }}
                                    key={index}
                                    style={styles.iconWrapper}
                                >
                                    <GlassView 
                                        blurPercent={0.5} 
                                        containerStyle={{
                                            width : buttonSide, 
                                            alignItems : 'center', 
                                            gap : 4, 
                                            padding : 10, 
                                            backgroundColor : 'rgba(255, 255, 255, 0.5)'
                                    }}>
                                        {IconComponent && (
                                            <IconComponent width={50} height={50} />
                                        )}
                                        <Text style={styles.iconLabel}>{label}</Text>
                                    </GlassView>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>맞춤 추천 공고</Text>
                        <Text style={styles.captionText}>사용자님의 관심을 분석하여 제공해 드려요</Text>
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{ gap: 16, paddingHorizontal: 16,}}
                        showsHorizontalScrollIndicator={false}
                        style={{ overflow: "visible" }}
                        data={noticeItems}
                        renderItem={({ item }) => (
                            <NoticeItem
                                item={item}
                            onPress={() => {
                                    props.navigation.navigate('InNotice', {Notice : item})
                                }}
                            />
                        )}
                        ListFooterComponent={
                            recomLoading ? (
                                <View style={styles.loadingContainer}>
                                    <Progress.Circle size={40} indeterminate color={Colors.primary} />
                                </View>
                            ) : null
                        }
                    />
                </View>
                {
                    bookmarkItems.length !== 0 && (
                        <View style={styles.flatListWrapper}>
                            <View style={styles.textWrapper}>
                                <Text style={styles.titleText}>내 일정 공고</Text>
                                <Text style={styles.captionText}>사용자님의 일정 중 마감 기한이 임박한 순으로 제공해 드려요</Text>
                            </View>
                            <FlatList
                                contentContainerStyle={{ gap: 16, paddingHorizontal: 16,}}
                                showsHorizontalScrollIndicator={false}
                                horizontal={false}
                                onEndReached={() => {}}
                                style={{ overflow: "visible" }}
                                data={bookmarkItems}
                                renderItem={({ item }) => (
                                <NoticeItem
                                    item={item}
                                    onPress={() => {
                                        props.navigation.navigate('InNotice', {Notice : item})
                                    }}
                                />
                                )}
                            />
                        </View>
                    )
                }
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.white1,
        gap: 16,
    },
    flatListContainer: {
        gap: 32,
        paddingVertical: 20,
    },
    bannerContainer : {
        gap : 24
    },
    flatListWrapper : {
        gap : 12
    },
    textWrapper : {
        gap : 6
    },
    titleText: {
        fontSize: 18,
        marginStart: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.black2,
    },
    captionText: {
        fontSize: 14,
        marginStart: 16,
        fontFamily: Fonts.reqular,
        color: Colors.gray2,
    },
    noticeItemListWrapper : {
        flexDirection : "row", 
        paddingHorizontal : 16, 
        gap : 16,
        flexWrap: "wrap",
    },
    iconWrapper : {
        alignItems : "center",
        gap : 6,
    },
    iconBox : {
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    iconLabel : {
        fontSize : 14,
        fontFamily : Fonts.medium,
        color : Colors.gray1
    },
    navIconContainer : {
        flexDirection : 'row',
        paddingHorizontal : 16,
        gap : 16
    },
    navIconWrapper : {
        alignItems : 'center',
        gap : 4,
        paddingHorizontal : 8
    },
    navIcon : {
        width : 48, 
        height : 48
    },
    navIconText : {
        textAlign : 'center', 
        fontFamily : Fonts.medium, 
        fontSize : 14,
        color : Colors.black2
    },
    mainText : {
        fontFamily : Fonts.semiBold,
        color : Colors.black1,
        fontSize : 28,
        marginStart : 16
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
});
