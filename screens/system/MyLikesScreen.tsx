import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    Dimensions,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from "react-native";
import  *  as  Progress  from  'react-native-progress' ;
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import {useCallback, useEffect, useRef, useState} from "react";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { parseReceptionPeriod } from "../../util/DateFormat";
import {getLikes} from "../../api/likes";
import {BeforeNoticeType, GetNoticesResponse, NoticeType} from "../../type/notice/notice.type";
import NoticeItem from "../../component/notice/NoticeItem";
import {RootStackParamList} from "../../navigation/RootStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DefaultImage } from "../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";

export type MyLikesScreenProps = NativeStackScreenProps<RootStackParamList>


const { height} = Dimensions.get("window");

const backgroundImage = DefaultImage.background

export default function MyLikesScreen({navigation}: MyLikesScreenProps){
    const [allLikes, setAllLikes] = useState<NoticeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);  // ✅ 추가
    const [page, setPage] = useState(0);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [isLast, setIsLast] = useState<boolean>(false);
    const lastRequestTime = useRef<number>(0);
    const insets = useSafeAreaInsets()

    // ✅ fetchLikes를 useCallback으로 변경
    const fetchLikes = useCallback(async (isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setIsLast(false);
            setPage(0);

            const response: GetNoticesResponse = await getLikes(0);
            setIsLast(response.data.isLast);

            const mapped = response.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    isLiked: true,
                    startDate,
                    endDate,
                };
            });
            setAllLikes(mapped);
        } catch (error) {
            ShowToast(
                "문제가 발생하였습니다",
                "데이터를 불러오지 못하였습니다",
                ToastType.ERROR
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLikes(false);
    }, [fetchLikes]);

    // ✅ 새로고침 핸들러 추가
    const handleRefresh = () => {
        fetchLikes(true);
    };

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (!viewableItems || viewableItems.length === 0 || allLikes.length === 0) return;

        const lastVisibleItem = viewableItems[viewableItems.length - 1];
        if (!lastVisibleItem) return;

        const lastIndex = lastVisibleItem.index;

        if (lastIndex >= allLikes.length - 5 && !isLast) {
            loadNextPage();
        }
    };

    const loadNextPage = async () => {
        const now = Date.now();

        if (now - lastRequestTime.current < 500) {
            return;
        }

        if (isFetchingNextPage || loading || isLast) return;

        lastRequestTime.current = now;
        const nextPage = page + 1;
        setIsFetchingNextPage(true);

        try {
            const response = await getLikes(nextPage);
            setIsLast(response.data.isLast);

            const data = response.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    isLiked: true,
                    startDate,
                    endDate,
                };
            });

            if (data.length > 0) {
                setPage(nextPage);
                setAllLikes(prev => [...prev, ...data]);
            }
        } catch (error) {
            ShowToast(
                "문제가 발생하였습니다",
                "데이터를 불러오지 못하였습니다",
                ToastType.ERROR
            );
        } finally {
            setIsFetchingNextPage(false);
        }
    };

    const updateNoticeInList = useCallback((noticeId: number, _newIsLiked: boolean) => {
        setAllLikes(prevNotices =>
            prevNotices.filter(notice => notice.id !== noticeId)  // ✅ 좋아요 해제시 목록에서 제거
        );
    }, []);

    const renderItem = useCallback((item : NoticeType) => (
        <View style={styles.noticeItemContainer}>
            <NoticeItem
                item={item}
                onPress={()=>{
                    navigation.navigate('InNotice', {
                        Notice: item,
                        onGoBack: updateNoticeInList
                    })
                }}
            />
        </View>
    ), [])

    return (
        <ImageBackground 
            source={backgroundImage}
            style={[styles.container, {paddingTop : insets.top, paddingBottom : insets.bottom}]}
        >
            <SubHeaderBar
                title="내 북마크"
                handleBackPress={navigation.goBack}
            />
            <FlashList
                removeClippedSubviews={true}
                data={refreshing ? [] : allLikes}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={handleRefresh}
                        colors={[Colors.white1]}
                        tintColor={Colors.white1}
                    />
                }
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                renderItem={({item}) => (
                    renderItem(item)
                )}
                ListFooterComponent={
                    loading || isFetchingNextPage ?
                        <View style={[styles.indicatorContainer, {marginTop: height*0.25}]}>
                            <Progress.Circle
                                color={Colors.primary}
                                size={50}
                                indeterminate={true}
                                thickness={300}
                            />
                        </View> : <View style={{height: 16}}/>
                }
                ListEmptyComponent={
                    refreshing ? (
                        <View style={styles.emptyContainer}>
                            <Progress.Circle
                                color={Colors.primary}
                                size={50}
                                indeterminate={true}
                                thickness={300}
                            />
                        </View>
                    ) : !loading && !isFetchingNextPage ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>
                                좋아요한 공고가 없습니다.
                            </Text>
                        </View>
                    ) : null
                }
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    // ... 기존 스타일들 유지
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    noticeItemContainer: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    indicatorContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    emptyContainer: {
        height: height * 0.7,  // ✅ 고정 높이로 중앙 정렬
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium
    }
});
