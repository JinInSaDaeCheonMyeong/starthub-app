import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import {
    Dimensions,
    FlatList,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import  *  as  Progress  from  'react-native-progress' ;
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import {useCallback, useEffect, useRef, useState} from "react";
import { ShowToast, ToastType } from "../../util/ShowToast";
import {getLikes} from "../../api/likes";
import {BeforeNoticeType, GetNoticesResponse, NoticeType} from "../../type/notice/notice.type";
import NoticeItem from "../../component/notice/NoticeItem";
import BackButton from "../../component/BackButton";
import EditIcon from "../../assets/icons/header/edit.svg";
import {CompositeScreenProps} from "@react-navigation/core";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../navigation/HomeStack";
import {RootStackParamList} from "../../navigation/RootStack";


export type MyLikesScreenProps = CompositeScreenProps<
    StackScreenProps<SystemStackParamList, 'MyLikes'>,
    StackScreenProps<RootStackParamList>
>


const {width, height} = Dimensions.get("window");

export default function MyLikesScreen({navigation, route : {params}}: MyLikesScreenProps){
    const parseReceptionPeriod = (period: string) => {
        try {
            if (!period || typeof period !== 'string') {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            const parts = period.split("~").map(str => str.trim());

            if (parts.length !== 2) {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            const [startPart, endPart] = parts;
            const startDateStr = startPart.split(" ")[0];
            const endDateStr = endPart.split(" ")[0];

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            const startDate = new Date(startDateStr + 'T00:00:00');
            const endDate = new Date(endDateStr + 'T00:00:00');

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            return {
                startDate,
                endDate
            };
        } catch (error) {
            return {
                startDate: new Date(),
                endDate: new Date()
            };
        }
    };

    const [allLikes, setAllLikes] = useState<NoticeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const lastRequestTime = useRef<number>(0);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response: GetNoticesResponse = await getLikes(0);
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
                console.error('BMC 데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, []);

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (!viewableItems || viewableItems.length === 0 || allLikes.length === 0) return;

        const lastVisibleItem = viewableItems[viewableItems.length - 1];
        if (!lastVisibleItem) return;

        const lastIndex = lastVisibleItem.index;

        if (lastIndex >= allLikes.length - 5) {
            loadNextPage();
        }
    };

    const loadNextPage = async () => {
        const now = Date.now();

        if (now - lastRequestTime.current < 200) {
            return;
        }

        if (isFetchingNextPage || loading) return;

        lastRequestTime.current = now;
        const nextPage = page + 1;
        setIsFetchingNextPage(true);

        try {
            const response = await getLikes(nextPage);
            const data = response.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
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

    const updateNoticeInList = useCallback((noticeId: number, newIsLiked: boolean) => {
        console.log("=== updateNoticeInList 호출됨 ===");
        console.log("noticeId:", noticeId);
        console.log("newIsLiked:", newIsLiked);

        setAllLikes(prevNotices => {
            console.log("현재 likes 개수:", prevNotices.length);
            const updatedNotices = prevNotices.map(notice =>
                notice.id === noticeId
                    ? { ...notice, isLiked: newIsLiked }
                    : notice
            );
            console.log("업데이트 완료");
            return updatedNotices;
        });
    }, []);



    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <BackButton
                        width={24}
                        height={24}
                        color={Colors.black2}
                        onClick={() => {navigation.goBack()}}
                    />
                    <Text style={styles.headerTitle}>북마크</Text>
                    <View style={styles.headerRight}/>
                </View>
            </View>
            <FlatList
                data={allLikes}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                renderItem={({item}) => (
                    <View style={styles.noticeItemContainer}>
                        <NoticeItem
                            item={item}
                            isHome={false}
                            onPress={()=>{
                                navigation.navigate('InNotice', {
                                    Notice: item,
                                    onGoBack: updateNoticeInList
                                })
                            }}
                        />
                    </View>
                )}
                ListFooterComponent={
                    loading || isFetchingNextPage?
                        <View style={[styles.indicatorContainer, {marginTop:height*0.25}]}>
                            <Progress.Circle
                                color={Colors.primary}
                                size = { 50 } indeterminate = { true }
                                thickness = {300}
                            />
                        </View>: <View style={{height:16}}/>
                }
                ListEmptyComponent={
                    !loading || isFetchingNextPage?
                        <View style={[styles.emptyContainer,{marginTop:height*0.25}]}>
                            <Text style={styles.emptyContainerText}>존재하는 공고가 없습니다.</Text>
                        </View>: <View/>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    headerTitle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 18,
        color: Colors.gray1,
    },
    headerRight: {
        width: 24,
        height: 24,
        color : Colors.black2
    },
    mainContainer : {
        flex : 1,
    },
    scorllContainer : {
        paddingHorizontal : 16,
        paddingTop : 16,
        paddingBottom : 32,
        flex : 1
    },
    labelContainer : {
        width : "100%",
        gap : 12
    },
    line : {
        width : "100%",
        borderBottomWidth : 2,
        borderColor : Colors.white2
    },
    dataContainer : {
        width : "100%",
        padding : 16,
        borderRadius : 8,
        backgroundColor : Colors.white2
    },
    labelText : {
        fontSize : 16,
        fontFamily : Fonts.bold,
        color : Colors.black2
    },
    dataText : {
        fontSize : 14,
        fontFamily : Fonts.medium,
        color : Colors.black2
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium
    }
})