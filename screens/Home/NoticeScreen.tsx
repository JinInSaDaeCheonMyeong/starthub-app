import {Dimensions, FlatList, ScrollView, StyleSheet, Text, View} from "react-native";
import SearchBar from "../../component/home/SearchBar";
import DropDown from "../../component/DropDown";
import { Colors } from "../../constants/Color";
import {useEffect, useState, useRef, useCallback} from "react";
import {useFocusEffect} from '@react-navigation/native';
import {BusinessExperienceItems} from "../../constants/BusinessExperienceItems";
import {ShowToast, ToastType} from "../../util/ShowToast";
import NoticeItem from "../../component/notice/NoticeItem";
import  *  as  Progress  from  'react-native-progress' ;
import { Fonts } from "../../constants/Fonts";
import {BeforeNoticeType, GetNoticesResponse, NoticeType} from "../../type/notice/notice.type";
import {getNotices} from "../../api/notice";
import {CompositeScreenProps} from "@react-navigation/core";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../navigation/HomeStack";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/RootStack";
import {SupportFieldItems} from "../../constants/SupportFieldItems";
import {RegionItems} from "../../constants/RegionItems";
import {TargetAgeItems} from "../../constants/TargetAgeItems";
import {isAxiosError} from "axios";

const {height} = Dimensions.get('window');

export type NoticeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, 'Notice'>,
    StackScreenProps<RootStackParamList>
>


export default function NoticeScreen({navigation, route : {params}}: NoticeScreenProps) {

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

    const [title, setTitle] = useState("");
    const [supportField, setSupportField] = useState("");
    const [supportFieldOpen, setSupportFieldOpen] = useState(false);
    const [region, setRegion] = useState("");
    const [regionOpen, setRegionOpen] = useState(false);
    const [targetAge, setTargetAge] = useState("");
    const [targetAgeOpen, setTargetAgeOpen] = useState(false);
    const [businessExperience, setBusinessExperience] = useState("");
    const [businessExperienceOpen, setBusinessExperienceOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const lastRequestTime = useRef<number>(0);
    const dropDownMargin = [regionOpen,supportFieldOpen,targetAgeOpen,businessExperienceOpen].some(item => item) ? 200 : 16;

    const [allNotices, setAllNotices] = useState<NoticeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLast, setIsLast] = useState<boolean>(false);

    const isInitialMount = useRef(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isFirst, setIsFirst] = useState(false);

    const fetchNotices = useCallback(async (isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
                setPage(0);
            } else {
                setRefreshing(true);
            }

            let currentSupportField = supportField;
            if (!isFirst){
                if (typeof params?.supportField === "string" && params.supportField !== supportField) {
                    currentSupportField = params.supportField;
                    setSupportField(params.supportField);
                }
                setIsFirst(true);
            }

            const response: GetNoticesResponse = await getNotices(title, currentSupportField, region, targetAge, businessExperience, 0);
            setIsLast(response.data.isLast);

            const mapped = response.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    startDate,
                    endDate,
                };
            });

            setAllNotices(mapped);
        } catch (error) {
            if(isAxiosError(error)) {
                console.log(error.response);
            }
            ShowToast(
                "문제가 발생하였습니다",
                "데이터를 불러오지 못하였습니다",
                ToastType.ERROR
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [title, supportField, region, targetAge, businessExperience, params?.supportField]);

    // 필터 변경 시 API 호출 (초기 마운트 제외)
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        fetchNotices(false);
    }, [title, supportField, region, targetAge, businessExperience]);

    // 화면 포커스시 새로고침 (탭바로 들어올 때)
    useFocusEffect(
        useCallback(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            }
            fetchNotices(true);
        }, [fetchNotices])
    );

    // params 변경 처리를 별도로
    useEffect(() => {
        if (params?.supportField && params.supportField !== supportField) {
            setSupportField(params.supportField);
        }
    }, [params?.supportField]);

    const loadNextPage = async () => {
        const now = Date.now();

        // 500ms로 증가하여 중복 요청 방지 강화
        if (now - lastRequestTime.current < 500) {
            return;
        }

        if (isFetchingNextPage || loading || isLast) return;

        lastRequestTime.current = now;
        const nextPage = page + 1;
        setIsFetchingNextPage(true);

        try {
            const response = await getNotices(title, supportField, region, targetAge, businessExperience, nextPage);
            setIsLast(response.data.isLast);

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
                setAllNotices(prev => [...prev, ...data]);
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

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (!viewableItems || viewableItems.length === 0 || allNotices.length === 0) return;

        const lastVisibleItem = viewableItems[viewableItems.length - 1];
        if (!lastVisibleItem) return;

        const lastIndex = lastVisibleItem.index;

        if (lastIndex >= allNotices.length - 5 && !isLast) {
            loadNextPage();
        }
    };

    const updateNoticeInList = useCallback((noticeId: number, newIsLiked: boolean) => {
        setAllNotices(prevNotices =>
            prevNotices.map(notice =>
                notice.id === noticeId
                    ? { ...notice, isLiked: newIsLiked }
                    : notice
            )
        );
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotices(true);
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.searchBar}>
                    <SearchBar
                        onPress={(text)=> setTitle(text)}
                    />
                </View>
                <View style={
                    {
                        marginTop:80,
                        position: "absolute",
                        width: '100%',
                        backgroundColor: Colors.white1,
                        height: 60,
                        zIndex: 700
                    }
                }/>
                <ScrollView
                    style={{position: "absolute",zIndex: 999, paddingTop: 80}}
                    keyboardShouldPersistTaps="handled"
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    <View style={{paddingBottom: dropDownMargin, marginStart: 16}}>
                        <DropDown
                            placeholderStyle={styles.dropDownPlaceHolder}
                            labelStyle={styles.dropDownLabel}
                            textStyle={styles.dropDownText}
                            open={supportFieldOpen}
                            value={supportField}
                            items={SupportFieldItems}
                            placeholder={"지원분야"}
                            setOpen={setSupportFieldOpen}
                            minWidth={90}
                            maxWidth={150}
                            setValue={(s) => {
                                if (s === supportField) {
                                    setSupportField("");
                                }
                                else {
                                    setSupportField(s);
                                }
                            }}
                        />
                    </View>
                    <View style={{marginStart: 16}}>
                        <DropDown
                            placeholderStyle={
                                {
                                    color : Colors.gray2,
                                    fontSize : 14,
                                    fontFamily : Fonts.medium
                                }
                            }
                            open={regionOpen}
                            value={region}
                            items={RegionItems}
                            placeholder={"지역"}
                            setOpen={setRegionOpen}
                            minWidth={70}
                            maxWidth={120}
                            setValue={(s) => {
                                if (s === region) {
                                    setRegion("");
                                }
                                else {
                                    setRegion(s);
                                }
                            }}
                        />
                    </View>
                    <View style={{ marginStart: 16}}>
                        <DropDown
                            placeholderStyle={
                                {
                                    color : Colors.gray2,
                                    fontSize : 14,
                                    fontFamily : Fonts.medium
                                }
                            }
                            open={targetAgeOpen}
                            value={targetAge}
                            items={TargetAgeItems}
                            placeholder={"연령"}
                            setOpen={setTargetAgeOpen}
                            minWidth={120}
                            maxWidth={250}
                            setValue={(s) => {
                                if (s === targetAge) {
                                    setTargetAge("");
                                }
                                else {
                                    setTargetAge(s);
                                }
                            }}
                        />
                    </View>
                    <View style={{marginStart: 16, marginEnd: 16}}>
                        <DropDown
                            placeholderStyle={
                                {
                                    color : Colors.gray2,
                                    fontSize : 14,
                                    fontFamily : Fonts.medium
                                }
                            }
                            open={businessExperienceOpen}
                            value={businessExperience}
                            items={BusinessExperienceItems}
                            placeholder={"창업업력"}
                            setOpen={setBusinessExperienceOpen}
                            minWidth={90}
                            maxWidth={150}
                            setValue={(s) => {
                                if (s === businessExperience) {
                                    setBusinessExperience("");
                                }
                                else {
                                    setBusinessExperience(s);
                                }
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
            <FlatList
                style={{paddingTop: 50}}
                data={refreshing ? [] : allNotices}  // ✅ 새로고침 시 빈 배열
                refreshing={false}  // ✅ 이렇게 변경
                onRefresh={refreshing ? undefined : handleRefresh}
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
                                size={50}
                                indeterminate={true}
                                thickness={300}
                            />
                        </View>: <View style={{height:16}}/>
                }
                ListEmptyComponent={
                    refreshing ? (  // ✅ 새로고침 중일 때 중앙에 인디케이터
                        <View style={[styles.indicatorContainer, {marginTop:height*0.25}]}>
                            <Progress.Circle
                                color={Colors.primary}
                                size={50}
                                indeterminate={true}
                                thickness={300}
                            />
                        </View>
                    ) : !loading && !isFetchingNextPage ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>존재하는 공고가 없습니다.</Text>
                        </View>
                    ) : <View/>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 25,
        height: 40,
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
        marginTop: height * 0.25,
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium
    },
    refreshIndicatorContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    dropDownPlaceHolder: {
        color : Colors.gray2,
        fontSize : 14,
        fontFamily : Fonts.medium
    },
    dropDownText : {
        color : Colors.black2,
        fontSize : 14,
        fontFamily : Fonts.medium,
        paddingVertical : 8,
        paddingHorizontal : 6,
    },
    dropDownLabel : {
        color : Colors.black2,
        fontSize : 14,
        fontFamily : Fonts.medium,
    }
})