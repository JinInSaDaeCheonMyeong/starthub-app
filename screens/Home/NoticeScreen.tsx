import {Dimensions, FlatList, Linking, ScrollView, StyleSheet, Text, View} from "react-native";
import SearchBar from "../../component/home/SearchBar";
import DropDown from "../../component/DropDown";
import { Colors } from "../../constants/Color";
import {useEffect, useState, useRef} from "react";
import {LocationItems} from "../../constants/LocationItems";
import {CategoryItems} from "../../constants/CategoryItems";
import {TargetItems} from "../../constants/TargetItems";
import {YearsItems} from "../../constants/YearsItems";
import {EntreItems} from "../../constants/EntreItems";
import {notice} from "../../api/notice";
import {NoticeItemType} from "../../type/notice/notice.type";
import {ShowToast, ToastType} from "../../util/ShowToast";
import NoticeItem from "../../component/notice/NoticeItem";
import  *  as  Progress  from  'react-native-progress' ;
import { Fonts } from "../../constants/Fonts";


const {height} = Dimensions.get('window');


export default function NoticeScreen() {
    const [location, setLocation] = useState("");
    const [locationOpen, setLocationOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [target, setTarget] = useState("");
    const [targetOpen, setTargetOpen] = useState(false);
    const [years, setYears] = useState("");
    const [yearsOpen, setYearsOpen] = useState(false);
    const [entre, setEntre] = useState("");
    const [entreOpen, setEntreOpen] = useState(false);
    const [items, setItems] = useState<NoticeItemType[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const lastRequestTime = useRef<number>(0);
    const dropDownMargin = [locationOpen,categoryOpen,targetOpen,yearsOpen,entreOpen].some(item => item) ? 200 : 16;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);  // 로딩 시작
                setPage(1);
                const data = await notice(1, category, location, target, years, entre, search);
                setItems(data);
            } catch (error) {
                ShowToast(
                    "문제가 발생하였습니다",
                    "데이터를 불러오지 못하였습니다.",
                    ToastType.ERROR
                )
            } finally {
                setIsLoading(false);  // 로딩 종료
            }
        };
        fetchData();
    }, [category, location, target, search, years, entre]);
    const loadNextPage = async () => {
        const now = Date.now();
        
        // 0.2초(200ms) 이내에 요청이 있었다면 차단
        if (now - lastRequestTime.current < 200) {
            return;
        }
        
        if (isFetchingNextPage || isLoading) return;
        
        lastRequestTime.current = now; // 요청 시간 기록
        const nextPage = page + 1;
        setPage(nextPage);  // 페이지 먼저 증가
        setIsFetchingNextPage(true);
        
        try {
            const data = await notice(nextPage, category, location, target, years, entre, search);
            if (data.length > 0) {
                setItems(prev => [...prev, ...data]);
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
        if (!viewableItems || viewableItems.length === 0 || items.length === 0) return;
        
        const lastVisibleItem = viewableItems[viewableItems.length - 1];
        if (!lastVisibleItem) return;
        
        const lastIndex = lastVisibleItem.index;
        
        if (lastIndex >= items.length - 5) {
            loadNextPage();
        }
    };

    function goWeb(link: string) {
        const handlePress = () => {
            Linking.openURL(link);
        }; handlePress()
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.searchBar}>
                    <SearchBar
                        onPress={(text)=> setSearch(text)}
                    />
                </View>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    <View style={{marginStart: 16, paddingBottom: dropDownMargin}}>
                        <DropDown
                            placeholderStyle={
                                {
                                    color : Colors.gray2,
                                    fontSize : 14,
                                    fontFamily : Fonts.medium
                                }
                            }
                            open={categoryOpen}
                            value={category}
                            items={CategoryItems}
                            placeholder={"지원분야"}
                            setOpen={setCategoryOpen}
                            minWidth={90}
                            maxWidth={150}
                            setValue={(s) => {
                                if (s === category) {
                                    setCategory("");
                                }
                                else {
                                    setCategory(s);
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
                            open={locationOpen}
                            value={location}
                            items={LocationItems}
                            placeholder={"지역"}
                            setOpen={setLocationOpen}
                            minWidth={70}
                            maxWidth={120}
                            setValue={(s) => {
                                if (s === location) {
                                    setLocation("");
                                }
                                else {
                                    setLocation(s);
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
                            open={targetOpen}
                            value={target}
                            items={TargetItems}
                            placeholder={"대상"}
                            setOpen={setTargetOpen}
                            minWidth={80}
                            maxWidth={140}
                            setValue={(s) => {
                                if (s === target) {
                                    setTarget("");
                                }
                                else {
                                    setTarget(s);
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
                            open={yearsOpen}
                            value={years}
                            items={YearsItems}
                            placeholder={"연령"}
                            setOpen={setYearsOpen}
                            minWidth={120}
                            maxWidth={250}
                            setValue={(s) => {
                                if (s === years) {
                                    setYears("");
                                }
                                else {
                                    setYears(s);
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
                            open={entreOpen}
                            value={entre}
                            items={EntreItems}
                            placeholder={"창업입력"}
                            setOpen={setEntreOpen}
                            minWidth={90}
                            maxWidth={150}
                            setValue={(s) => {
                                if (s === entre) {
                                    setEntre("");
                                }
                                else {
                                    setEntre(s);
                                }
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
            <FlatList
                data={items}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                renderItem={({item}) => (
                    <View style={styles.noticeItemContainer}>
                        <NoticeItem
                            webLink={item.webLink}
                            isHome={false}
                            onPress={() => {goWeb(item.webLink)}}
                            id={item.id}
                            category={item.category}
                            title={item.title}
                            location={item.location}
                            years={item.years}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            target={item.target}
                            entre={item.entre}
                        />
                    </View>
                )}
                ListFooterComponent={
                isLoading || isFetchingNextPage?
                    <View style={[styles.indicatorContainer, {marginTop:height*0.25}]}>
                        <Progress.Circle
                            color={Colors.primary}
                            size = { 50 } indeterminate = { true }
                            thickness = {300}
                        />
                    </View>: <View style={{height:16}}/>
                }
                ListEmptyComponent={
                !isLoading || isFetchingNextPage?
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