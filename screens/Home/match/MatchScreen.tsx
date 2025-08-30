import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/core";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { useCallback, useRef, useState, useEffect } from "react";
import { getRecruitsList } from "../../../api/recruits";
import { ShowToast, ToastType } from "../../../util/ShowToast";
import { isAxiosError } from "axios";
import RecruitsItem from "../../../component/notice/RecruitsItem";
import { HomeStackParamList } from "../../../navigation/HomeStack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { RecruitsItemType } from "../../../type/notice/recruits.type";
import { ErrorResponse } from "../../../type/util/response.type";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import SearchBar from "../../../component/home/SearchBar";
import * as Progress from 'react-native-progress';

export type MatchScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Match">,
    StackScreenProps<RootStackParamList>
>;

export default function MatchScreen({ navigation }: MatchScreenProps) {
    const [recruitsItems, setRecruitsItems] = useState<RecruitsItemType[]>([]);
    const [filteredList, setFilteredList] = useState<RecruitsItemType[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const lastRequestTime = useRef<number>(0);
    const hasFetchedOnce = useRef(false);
    const { height } = useWindowDimensions();

    const filterRecruits = useCallback((text: string, list: RecruitsItemType[]) => {
        const filtered = list.filter(item =>
            item.title.toLowerCase().includes(text.toLowerCase()) ||
            item.companyName.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredList(filtered);
    }, []); 

    const getRecruitsItems = async (reset = false) => {
        if (isFetching) {
            return;
        }

        // if (reset && hasFetchedOnce.current) return;

        const nextPage = reset ? 0 : page;
        const now = Date.now();

        if (!reset && now - lastRequestTime.current < 200) {
            return;
        }
        lastRequestTime.current = now;

        setIsFetching(true);

        try {
            const response = (await getRecruitsList(nextPage, 10)).data;

            if (response.empty || response.content.length === 0) {
                setHasMore(false);
                if (reset) {
                    setRecruitsItems([]);
                }
                return;
            }

            setPage(reset ? 1 : nextPage + 1);

            if (reset) {
                setRecruitsItems(response.content);
                setHasMore(true);
                hasFetchedOnce.current = true;
            } else {
                setRecruitsItems(prev => {
                    const updatedMap = new Map(prev.map(item => [item.id, item]));
                    response.content.forEach(item => {
                        updatedMap.set(item.id, item);
                    });
                    const newList = Array.from(updatedMap.values());
                    return newList;
                });
            }
        } catch (error: unknown) {
            const errMsg = isAxiosError(error)
                ? error.response
                    ? (error.response.data as ErrorResponse).message
                    : "네트워크 오류가 발생했습니다"
                : "알 수 없는 오류가 발생했습니다";
            ShowToast("오류 발생", errMsg, ToastType.ERROR);
        } finally {
            setIsFetching(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getRecruitsItems(true);
        }, []) 
    );

    useEffect(() => {
        filterRecruits(search, recruitsItems);
    }, [recruitsItems, search, filterRecruits]); 

    const onSearch = (text: string) => {
        setSearch(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <SearchBar onPress={onSearch} />
            </View>
            <FlatList
                style={styles.list}
                data={filteredList}
                contentContainerStyle={styles.content}
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                    if (!isFetching && hasMore) {
                        getRecruitsItems(false);
                    }
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RecruitsItem
                        {...item}
                        isHome={false}
                        onPress={id => navigation.navigate("InMatch", { matchId: id })}
                    />
                )}
                ListFooterComponent={() => {
                    return isFetching && hasMore ? (
                        <View style={[styles.indicatorContainer, { marginTop: height * 0.05 }]}>
                            <Progress.Circle
                                color={Colors.primary}
                                size={36}
                                indeterminate={true}
                                thickness={4}
                            />
                        </View>
                    ) : <View style={{ height: 16 }} />;
                }}
                ListEmptyComponent={() => {
                    return !isFetching && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>일치하는 채용 공고가 없습니다.</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        color: Colors.black2,
        fontFamily: Fonts.semiBold,
        fontSize: 18,
        margin: 16,
    },
    list: {
        paddingHorizontal: 16,
    },
    content: {
        gap: 16,
        paddingBottom: 16,
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 25,
        height: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.gray2,
        fontFamily: Fonts.medium,
    },
    indicatorContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    }
});