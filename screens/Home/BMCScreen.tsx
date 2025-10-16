import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image, Dimensions,
} from "react-native";
import {Fonts} from "../../constants/Fonts";
import {Colors} from "../../constants/Color";
import {PaperProvider} from "react-native-paper";
import {CompositeScreenProps} from "@react-navigation/core";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../navigation/HomeStack";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/RootStack";
import {getBMCs} from "../../api/bmc";
import {useEffect, useState} from "react";
import {BMCType, GetBMCsResponse} from "../../type/BMC/BMC.type";
import { formatToDate } from "../../util/DateFormat";
import BMCItem from "../../component/home/BMCItem";

const screenWidth = Dimensions.get('window').width;

export type BMCScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, 'BMC'>,
    StackScreenProps<RootStackParamList>
>

export default function BMCScreen(navigation: BMCScreenProps) {
    const [allBMCs, setAllBMCs] = useState<BMCType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBMCs = async () => {
            try {
                const response: GetBMCsResponse = await getBMCs();
                setAllBMCs(response.data);
            } catch (error) {
                console.error('BMC 데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBMCs();
    }, []);

    const BMCs = async ()=> {
        return await getBMCs();
    }
    return (
        <View style={styles.container}>
            <PaperProvider>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={allBMCs}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />} // 세로 간격
                    ListHeaderComponent={
                        <View style={{ paddingHorizontal: 0 }}>
                            <Text style={[styles.headerText, {marginTop: 16}]}>최근 BMC </Text>
                            <FlatList
                                data={allBMCs.slice(0,8)}
                                horizontal={true}
                                ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // 세로 간격
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={
                                    <View style={styles.flatMargin}/>
                                }
                                renderItem={({item}) => (
                                    <BMCItem
                                        width={189}
                                        height={120}
                                        imageSource={{uri : item.imageUrl}}
                                        title={item.title}
                                        subText={formatToDate(item.updatedAt, 'dotted')}
                                        onPress={() => navigation.navigation.navigate('InBMC', {
                                            BMC : item
                                        })}
                                        isHorizontal
                                    />
                                )
                                }
                            />
                            <Text style={styles.middleText}>내 BMC</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={{paddingHorizontal:16}}>
                            <BMCItem
                                title={item.title}
                                imageSource={{uri : item.imageUrl}}
                                subText={formatToDate(item.updatedAt, 'dotted')}
                                onPress={() => navigation.navigation.navigate('InBMC', {
                                    BMC : item
                                })}
                            />
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={{marginTop: 20}}/>
                    }
                />
            </PaperProvider>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
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
        height: 153,
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
        height: 260,
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
    }
})