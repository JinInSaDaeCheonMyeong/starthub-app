import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image, Dimensions,
} from "react-native";
import {Fonts} from "../../constants/Fonts";
import {Colors} from "../../constants/Color";
import {Shadow} from "react-native-shadow-2";
import {BMCDummyData} from "../../constants/dummy/BMCDummy";
import {PaperProvider} from "react-native-paper";
import {CompositeScreenProps} from "@react-navigation/core";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../navigation/HomeStack";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/RootStack";

const screenWidth = Dimensions.get('window').width;

export type BMCScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, 'BMC'>,
    StackScreenProps<RootStackParamList>
>

export default function BMCScreen(navigation: BMCScreenProps) {
    const recentBMC = BMCDummyData
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 8);
    return (
        <View style={styles.container}>
            <PaperProvider>
            <FlatList
                data={BMCDummyData}
                numColumns={2}
                columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'space-between' }}
                ListHeaderComponent={
                <View style={{ paddingHorizontal: 0 }}>
                    <Text style={[styles.headerText, {marginTop: 16}]}>최근 BMC </Text>
                    <FlatList
                        data={recentBMC}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListHeaderComponent={
                            <View style={styles.flatMargin}/>
                        }
                        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                        renderItem={({item}) => (
                            <Shadow
                                distance={4}
                                offset={[0, 4]}
                                startColor="rgba(185, 185, 185, 0.2)"
                                style={{ marginVertical: 4, marginHorizontal: 2, borderRadius: 8}}
                            >
                            <TouchableOpacity>
                                <View style={styles.recentBMCBox}>
                                    <Image
                                        source={item.thumbnail}
                                        style={styles.thumbnail}
                                    />
                                    <View style={styles.BMCContentContainer}>
                                        <View style={styles.BMCTextContainer}>
                                            <Text style={styles.titleText}>{item.title}</Text>
                                            <Text style={styles.dateText}>
                                                {item.date.toLocaleDateString('ko-KR')}
                                            </Text>
                                        </View>
                                    </View>
                                    </View>
                            </TouchableOpacity>
                            </Shadow>
                        )
                    }
                    />
                    <Text style={styles.middleText}>내 BMC</Text>
                </View>
                }
                renderItem={({ item }) => (
                    <Shadow
                        distance={4}
                        offset={[0, 4]}
                        startColor="rgba(185, 185, 185, 0.2)"
                        style={{ marginVertical: 4, marginHorizontal: 2, borderRadius: 8 ,marginBottom: 16}}
                    >
                        <TouchableOpacity onPress={()=>{navigation.navigation.navigate('InBMC', {
                            BMC:item
                        })}}>
                            <View style={[styles.myBMCBox, {width : screenWidth/2-30}]}>
                                <Image
                                    source={item.thumbnail}
                                    style={styles.thumbnail}
                                />
                                <View style={styles.BMCContentContainer}>
                                    <View style={styles.BMCTextContainer}>
                                        <Text style={styles.titleText}>{item.title}</Text>
                                        <Text style={styles.dateText}>
                                            {item.date.toLocaleDateString('ko-KR')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Shadow>
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
        marginHorizontal: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    BMCTextContainer: {
        flexDirection: 'column',
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
        height: 153,
    },
    thumbnail: {
        width: '100%',
        resizeMode: 'cover',
        height: 100,
    }
})