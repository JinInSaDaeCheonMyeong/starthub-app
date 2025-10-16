import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image, Dimensions, RefreshControl,
} from "react-native";
import {Fonts} from "../../constants/Fonts";
import {Colors} from "../../constants/Color";
import {CompositeScreenProps} from "@react-navigation/core";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../navigation/HomeStack";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/RootStack";
import {getBMCs} from "../../api/bmc";
import {useCallback, useEffect, useRef, useState} from "react";
import {BMCType, GetBMCsResponse} from "../../type/BMC/BMC.type";
import  *  as  Progress  from  'react-native-progress' ;
import {useFocusEffect} from "@react-navigation/native";

const {width, height} = Dimensions.get('window');

export type BMCScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, 'BMC'>,
    StackScreenProps<RootStackParamList>
>

export default function BMCScreen(navigation: BMCScreenProps) {
    const [allBMCs, setAllBMCs] = useState<BMCType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBMCs = useCallback(async () => {
        console.log("asdkf")
        setLoading(true);
        try {
            const response: GetBMCsResponse = await getBMCs();
            setAllBMCs(response.data);
        } catch (error) {
            console.error('BMC 데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // 화면 포커스될 때마다 데이터 갱신
    useFocusEffect(
        useCallback(() => {
            fetchBMCs();
        }, [fetchBMCs])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchBMCs();
    };
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={[styles.indicatorContainer,]}>
                    <Progress.Circle
                        color={Colors.primary}
                        size = { 50 } indeterminate = { true }
                        thickness = {300}
                    />
                </View>
            </View>
        );
    }


    return (
        <View style={styles.container}>
                <FlatList
                    data={refreshing ? [] : allBMCs}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}  // ✅ 이렇게 변경
                            onRefresh={refreshing ? undefined : handleRefresh}
                            tintColor={Colors.white1}
                            colors={[Colors.white1]}
                        />
                    }
                    ListHeaderComponent={
                        allBMCs.length > 0 ? (  // ✅ 삼항 연산자 사용
                            <View style={{ paddingHorizontal: 0 }}>
                                <Text style={[styles.headerText, {marginTop: 16}]}>최근 BMC </Text>
                                <FlatList
                                    data={allBMCs.slice(0,8)}
                                    horizontal={true}
                                    ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                                    showsHorizontalScrollIndicator={false}
                                    ListHeaderComponent={
                                        <View style={styles.flatMargin}/>
                                    }
                                    renderItem={({item}) => (
                                        <TouchableOpacity onPress={() => navigation.navigation.navigate('InBMC', {BMC:item})}>
                                            <View style={{backgroundColor: Colors.white2, borderRadius: 8, padding:2}}>
                                                <View style={styles.recentBMCBox}>
                                                    <View style={styles.BMCContentContainer}>
                                                        <View style={styles.BMCTextContainer}>
                                                            <Text style={styles.titleText}>{item.title}</Text>
                                                            <Text style={styles.dateText}>
                                                                {item.updatedAt}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                                <Text style={styles.middleText}>내 BMC</Text>
                            </View>
                        ) : null  // ✅ null 추가
                    }
                    renderItem={({ item }) => (
                        <View style={{paddingHorizontal:16}}>
                            <TouchableOpacity onPress={()=>{navigation.navigation.navigate('InBMC', {
                                BMC:item
                            })}}>
                                <View style={{backgroundColor: Colors.white2, borderRadius: 8, padding:2}}>
                                    <View style={[styles.myBMCBox, {width : '100%'}]}>
                                        <View style={{backgroundColor: Colors.white2, borderTopLeftRadius: 8, borderTopRightRadius: 8}}/>
                                        <View style={[styles.BMCContentContainer,{backgroundColor:Colors.white1}]}>
                                            <View style={styles.BMCTextContainer}>
                                                <Text style={styles.titleText}>{item.title}</Text>
                                                <Text style={styles.dateText}>
                                                    {item.updatedAt}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={{marginTop: 20}}/>
                    }
                    ListEmptyComponent={
                        refreshing ? (  // ✅ 새로고침 중일 때도 인디케이터 추가
                            <View style={styles.emptyContainer}>
                                <Progress.Circle
                                    color={Colors.primary}
                                    size={50}
                                    indeterminate={true}
                                    thickness={300}
                                />
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    BMC 가 없습니다.
                                </Text>
                            </View>
                        )
                    }
                />
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white1,
        flex: 1,
        flexDirection: 'column',
    },
    headerText: {
        fontSize: 20,
        fontFamily: Fonts.semiBold,
        marginStart: 16,
        marginBottom: 18
    },
    recentBMCBox: {
        width: 189,
        height: 50,
        backgroundColor: Colors.white1,
        borderRadius: 8,
        flexDirection: 'column',
    },
    flatMargin: {
        width: 16,
    },
    BMCContentContainer: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: Colors.white1,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    BMCTextContainer: {
        flexDirection: 'column',
        paddingStart: 12
    },
    titleText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    dateText: {
        fontSize: 8,
        fontFamily: Fonts.light,
        color: Colors.gray1,
    },
    middleText: {
        fontSize: 20,
        fontFamily: Fonts.semiBold,
        marginStart: 16,
        marginTop: 36,
        marginBottom: 18
    },
    myBMCBox: {
        backgroundColor: Colors.white1,
        borderRadius: 8,
        flexDirection: 'column',
        height: 60,
        borderColor: Colors.white2,
        borderWidth: 2,
    },
    thumbnail: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        paddingHorizontal: 8,
        paddingVertical :8,
        backgroundColor: Colors.white2,
        width: '100%',
        resizeMode: 'cover',
        height: 100,
    },
    myBMCThumbnail: {
        paddingHorizontal: 8,
        paddingVertical :8,
        backgroundColor: Colors.white2,
        width: '100%',
        resizeMode: 'cover',
        height: 200,
    },
    indicatorContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    emptyContainer: {
        height: height * 0.7,  // ✅ 화면 높이의 70%
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        fontFamily: Fonts.medium,
        color: Colors.gray2,
    },
})