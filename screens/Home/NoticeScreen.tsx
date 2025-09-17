import {Dimensions, FlatList, Linking, ScrollView, StyleSheet, Text, View} from "react-native";
import SearchBar from "../../component/home/SearchBar";
import DropDown from "../../component/DropDown";
import { Colors } from "../../constants/Color";
import {useEffect, useState, useRef} from "react";
import {TargetItems} from "../../constants/TargetItems";
import {BusinessExperienceItems} from "../../constants/BusinessExperienceItems";
import {ShowToast, ToastType} from "../../util/ShowToast";
import NoticeItem from "../../component/notice/NoticeItem";
import  *  as  Progress  from  'react-native-progress' ;
import { Fonts } from "../../constants/Fonts";
import {BeforeNoticeType, GetNoticesResponse, NoticeType, NoticeTypeTrailer} from "../../type/notice/notice.type";
import {getNotices} from "../../api/notice";
import {CompositeScreenProps} from "@react-navigation/core";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../navigation/HomeStack";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/RootStack";
import {SupportFieldItems} from "../../constants/SupportFieldItems";
import {RegionItems} from "../../constants/RegionItems";
import {TargetAgeItems} from "../../constants/TargetAgeItems";


const {height} = Dimensions.get('window');

export type NoticeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, 'Notice'>,
    StackScreenProps<RootStackParamList>
>


export default function NoticeScreen({navigation, route : {params}}: NoticeScreenProps) {
    const parseReceptionPeriod = (period: string) => {
        try {
            if (!period || typeof period !== 'string') {
                console.warn('Invalid reception period:', period);
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            // "2025-09-01 ~ 2025-09-30 18:00" 형식에서 시간 제거하고 날짜만 추출
            const parts = period.split("~").map(str => str.trim());

            if (parts.length !== 2) {
                console.warn('Invalid period format - no ~ separator:', period);
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            const [startPart, endPart] = parts;

            // 시간 부분 완전히 제거하고 날짜만 추출
            // "2025-09-01" 또는 "2025-09-01 10:00" → "2025-09-01"
            const startDateStr = startPart.split(" ")[0];

            // "2025-09-30 18:00" 또는 "2025-09-30" → "2025-09-30"
            const endDateStr = endPart.split(" ")[0];

            // YYYY-MM-DD 형식인지 검증
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
                console.warn('Invalid date format:', { startDateStr, endDateStr, originalPeriod: period });
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            // Date 객체 생성 시 시간을 00:00:00으로 설정하여 날짜만 사용
            const startDate = new Date(startDateStr + 'T00:00:00');
            const endDate = new Date(endDateStr + 'T00:00:00');

            // 유효한 날짜인지 확인
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.warn('Invalid date created from:', {
                    startDateStr,
                    endDateStr,
                    originalPeriod: period
                });
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
            console.error('Error parsing reception period:', error, 'Period:', period);
            return {
                startDate: new Date(),
                endDate: new Date()
            };
        }
    };
    const [title, setTitle] = useState("");
    const [supportField, setSupportField] = useState<string>(
        typeof params?.supportField === "string" ? params.supportField : ""
    );

    // params.supportField가 바뀔 때마다 state 동기화
    useEffect(() => {
        if (typeof params?.supportField === "string") {
            setSupportField(params.supportField);
        }
    }, [params?.supportField]);
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

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                console.log(supportField);
                const response: GetNoticesResponse = await getNotices(title, supportField, region, targetAge, businessExperience, 0);
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
                console.error('공고 데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    },[title, supportField, region, targetAge, businessExperience, params?.supportField]);

    const loadNextPage = async () => {
        const now = Date.now();
        
        // 0.2초(200ms) 이내에 요청이 있었다면 차단
        if (now - lastRequestTime.current < 200) {
            return;
        }
        
        if (isFetchingNextPage || loading) return;
        
        lastRequestTime.current = now; // 요청 시간 기록
        const nextPage = page + 1;
        setPage(nextPage);  // 페이지 먼저 증가
        setIsFetchingNextPage(true);
        
        try {
            const response = await getNotices(title, supportField, region, targetAge, businessExperience, nextPage);
            const data = response.data.content.map((notice: BeforeNoticeType) => {
                const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
                return {
                    ...notice,
                    startDate,
                    endDate,
                };
            });;
            if (data.length > 0) {

                setAllNotices(prev => [...prev, ...data]);
            }
        } catch (error) {
            setPage(page);  // 실패 시 페이지 롤백
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
        
        if (lastIndex >= allNotices.length - 5) {
            loadNextPage();
        }
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
                            placeholderStyle={
                                {
                                    color : Colors.gray2,
                                    fontSize : 14,
                                    fontFamily : Fonts.medium
                                }
                            }
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
                            placeholder={"창업입력"}
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
                data={allNotices}
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
                            onPress={()=>{navigation.navigate('InNotice', {
                                Notice:item
                            })}}
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
        height: "100%",
        width: "100%",
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium
    }
})