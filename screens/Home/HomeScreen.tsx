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
    
export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [noticeItems, setNoticeItems] = useState<NoticeItemType[]>([]);
    const [recruitsItems, setRecruitsItems] = useState<RecruitsItemType[]>([]);

    const fetchNoticeItems = async () => {
        try {
        const response = await notice(1, "", "", "", "", "", "");
        setNoticeItems(response); // data 구조에 따라 조정
        } catch (error: unknown) {
        if (isAxiosError(error)) {
            const response = error.response;
            if (!response) {
            ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
            return;
            }
            const errorData = response.data as ErrorResponse;
            ShowToast("오류 발생", errorData.message, ToastType.ERROR);
            return;
        }
        ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        }
    };

    const getRecruitsItems = async (reset: boolean = false) => {
        try {
        const response = (await getRecruitsList(0, 10)).data;

        if (reset) {
            setRecruitsItems(response.content);
        } else {
            const map = new Map(recruitsItems.map((item) => [item.id, item]));
            response.content.forEach((item) => {
            map.set(item.id, item); // 덮어쓰기
            });
            const updatedList = Array.from(map.values());
            setRecruitsItems(updatedList);
        }
        } catch (error: unknown) {
        if (isAxiosError(error)) {
            const response = error.response;
            if (!response) {
            ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
            return;
            }
            const errorData = response.data as ErrorResponse;
            ShowToast("오류 발생", errorData.message, ToastType.ERROR);
            return;
        }
        ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        }
    };

    // 날짜 차이(밀리초) 절댓값 계산 함수
    const getClosestNotice = (items: NoticeItemType[]): NoticeItemType | null => {
    if (items.length === 0) return null;

    const now = new Date();


    // endTime이 문자열이라 Date로 변환 필요
    return items.reduce((prev, curr) => {
        const prevDate = new Date(prev.endTime);
        const currDate = new Date(curr.endTime);

        const prevDiff = Math.abs(prevDate.getTime() - now.getTime());
        const currDiff = Math.abs(currDate.getTime() - now.getTime());

        return currDiff < prevDiff ? curr : prev;
    });
    };


    function goWeb(link: string) {
        const handlePress = () => {
            Linking.openURL(link);
        }; handlePress()
      
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
            goWeb
        }
    } = useHomeScreen(props)

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ImminentView
                title={closestNotice ? closestNotice.title : "마감 임박 공고가 없습니다."}
                onPress={() => {
                    closestNotice ? goWeb(closestNotice.webLink) : ShowToast("오류 발생", "공고가 존재하지 않습니다", ToastType.ERROR)
                }}
            />
            <View style={{ height: 16 }} />
            <View style={commonContainer.container}>
            </View>
            <View style={{ height: 16 }} />
            <View style={[commonContainer.container, styles.flatListContainer]}>
            <Text style={styles.listText}>추천 공고</Text>
            <FlatList
                contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 16 }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                onEndReached={() => {}}
                style={{ overflow: "visible" }}
                data={noticeItems.length > 0 ? noticeItems : NoticeItemList}
                renderItem={({ item }) => (
                <NoticeItem
                    webLink={item.webLink}
                    id={item.id}
                    category={item.category}
                    title={item.title}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    location={item.location}
                    years={item.years}
                    target={item.target}
                    entre={item.entre}
                    isHome={true}
                    onPress={() => {
                        goWeb(item.webLink)
                    }}
                />
                )}
            />
            </View>
            <View style={[commonContainer.container, styles.flatListContainer]}>
            <Text style={styles.listText}>멤버 모집</Text>
            <FlatList
                contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 16 }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ overflow: "visible" }}
                data={recruitsItems}
                renderItem={({ item }) => (
                <RecruitsItem
                    id={item.id}
                    title={item.title}
                    companyName={item.companyName}
                    endDate={item.endDate}
                    viewCount={item.viewCount}
                    isClosed={item.isClosed}
                    createdAt={item.createdAt}
                    isHome={true}
                    onPress={(id) => {
                    navigation.navigate("InMatch", { matchId: id });
                    }}
                />
                )}
            />
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
                            noticeType, 
                            backgroundColor, 
                            iconColor
                        }, index) => {
                            const IconComponent = categoryMap[noticeType];
                            return (
                                <TouchableOpacity 
                                    onPress={() => {console.log(label)}} 
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
                        data={noticeItems.length > 0 ? noticeItems : NoticeItemList}
                        renderItem={({ item }) => (
                        <NoticeItem
                            webLink={item.webLink}
                            id={item.id}
                            category={item.category}
                            title={item.title}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            location={item.location}
                            years={item.years}
                            target={item.target}
                            entre={item.entre}
                            isHome={true}
                            onPress={() => {
                                goWeb(item.webLink)
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
                        data={noticeItems.length > 0 ? noticeItems : NoticeItemList}
                        renderItem={({ item }) => (
                        <NoticeItem
                            webLink={item.webLink}
                            id={item.id}
                            category={item.category}
                            title={item.title}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            location={item.location}
                            years={item.years}
                            target={item.target}
                            entre={item.entre}
                            isHome={true}
                            onPress={() => {
                                goWeb(item.webLink)
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
