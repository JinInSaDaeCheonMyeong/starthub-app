import { FlatList, Image, ScrollView,  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import NoticeItem from "../../component/notice/NoticeItem";
import { NoticeItemList } from "../../constants/NoticeItemList";
import { CompositeScreenProps } from "@react-navigation/core";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../../navigation/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import Carousel from "react-native-reanimated-carousel";
import useHomeScreen from "../../hooks/home/useHomeScreen";
import Banner from "../../component/home/Banner";
import { NoticeCategory } from "../../constants/NoticeCategory";
import BusinessIcon from "../../assets/icons/category/notice/business.svg"
import EducationIcon from "../../assets/icons/category/notice/education.svg"
import EventIcon from "../../assets/icons/category/notice/event.svg"
import FacilityIcon from "../../assets/icons/category/notice/facility.svg"
import FundingIcon from "../../assets/icons/category/notice/funding.svg"
import GlobalIcon from "../../assets/icons/category/notice/global.svg"
import RNDIcon from "../../assets/icons/category/notice/rnd.svg"
import TalentIcon from "../../assets/icons/category/notice/talent.svg"

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    StackScreenProps<RootStackParamList>
>;

export default function HomeScreen(props : HomeScreenProps) {
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
            carouselList,
            carouselMaxIndex,
            noticeCategoryList,
            navList
        },
        ui : {
            width,
            carouselHeight,
        },
        actions : {
            goNotice
        }
    } = useHomeScreen(props)

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.flatListContainer}>
                <View style={styles.bannerContainer}>
                    <Carousel
                        loop
                        width={width}
                        height={carouselHeight}
                        autoPlay
                        data={carouselList}
                        autoPlayInterval={5000}
                        scrollAnimationDuration={1300}
                        renderItem={({index, item : props}) => (
                            <Banner
                                {...props}
                                index={index + 1}
                                maxIndex={carouselMaxIndex}
                                height={carouselHeight}
                                onPress={() => {console.log('안녕')}}
                            />
                        )}
                    />
                    <View style={styles.navIconContainer}>
                        {navList.map(({icon, label, navItem}, index) => (
                            <TouchableOpacity 
                                onPress={() => {console.log(navItem)}}
                                key={index} 
                                style={styles.navIconWrapper}
                            >
                                <Image style={styles.navIcon} source={icon}/>
                                <Text style={styles.navIconText}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
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
                            backgroundColor, 
                            iconColor
                        }, index) => {
                            const IconComponent = categoryMap[noticeType];
                            return (
                                <TouchableOpacity 
                                    onPress={() => {goNotice(value)}}
                                    key={index} 
                                    style={styles.iconWrapper}
                                >
                                    <View style={[styles.iconBox, {backgroundColor}]}>
                                        {IconComponent && <IconComponent width={30} height={30} color={iconColor} />}
                                    </View>
                                    <Text style={styles.iconLabel}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>맞춤 추천 공고</Text>
                        <Text style={styles.captionText}>사용자님의 관심을 분석하여 제공해 드려요</Text>
                    </View>
                    <FlatList
                        contentContainerStyle={{ gap: 16, paddingHorizontal: 16,}}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        onEndReached={() => {}}
                        style={{ overflow: "visible" }}
                        data={noticeItems}
                        renderItem={({ item }) => (
                        <NoticeItem
                            item={item}
                            isHome={true}
                            onPress={() => {
                            }}
                        />
                        )}
                    />
                </View>
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>내 일정 공고</Text>
                        <Text style={styles.captionText}>사용자님의 일정 중 마감 기한이 임박한 순으로 제공해 드려요</Text>
                    </View>
                    <FlatList
                        contentContainerStyle={{ gap: 16, paddingHorizontal: 16,}}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        onEndReached={() => {}}
                        style={{ overflow: "visible" }}
                        data={noticeItems}
                        renderItem={({ item }) => (
                        <NoticeItem
                        item={item}
                            isHome={true}
                            onPress={() => {
                            }}
                        />
                        )}
                    />
                </View>
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
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    bannerContainer : {
        gap : 20
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
        fontFamily: Fonts.semiBold,
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
        width: 59.4,
        height: 59.4,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    iconLabel : {
        fontSize : 14,
        fontFamily : Fonts.medium,
        color : Colors.black2
    },
    navIconContainer : {
        flexDirection : 'row',
        paddingHorizontal : 16,
        gap : 16
    },
    navIconWrapper : {
        alignItems : 'center',
        gap : 8,
        flex : 1,
    },
    navIcon : {
        width : 48, 
        height : 48
    },
    navIconText : {
        textAlign : 'center', 
        fontFamily : Fonts.medium, 
        fontSize : 14
    }
});
