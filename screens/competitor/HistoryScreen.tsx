import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import {useFocusEffect} from "@react-navigation/native"
import { useCallback, useState } from "react";
import { CompetitorFormData } from "../../type/competitor/competitor.type";
import { getCompetitors } from "../../api/competitor";
import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import * as Progress from "react-native-progress"
import BMCItem from "../../component/home/BMCItem";
import { getBMC } from "../../api/bmc";
import { formatToDate } from "../../util/DateFormat";
import { ErrorResponse } from "../../type/util/response.type";
import { DefaultImage } from "../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";

type HistoryScreenProps = NativeStackScreenProps<CompoetitorStackParamList, 'History'>
const backgroundImage = DefaultImage.background

export function HistoryScreen({navigation} : HistoryScreenProps) {
    const [competitorList, setCompetitorList] = useState<CompetitorFormData[]>([])
    const [loading, setLoading] = useState(true)
    const renderItem = useCallback(
        ({ item }: { item: CompetitorFormData }) => (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Result', {
                        bmcId: item.bmcId,
                        image: { uri: item.bmcImage, cache: 'force-cache' },
                        data: item,
                    })
                }>
                <BMCItem
                    title={item.userBmc.title}
                    imageSource={{ uri: item.bmcImage, cache: 'force-cache'}}
                    onPress={() =>
                        navigation.navigate('Result', {
                        bmcId: item.bmcId,
                        image: { uri: item.bmcImage, cache: 'force-cache'},
                        data: item,
                        })
                    }
                    isCompetitor
                    subText={formatToDate(item.createdAt, 'dotted')}
                />
            </TouchableOpacity>
        ), []
    );
    
    const initData = async () => {
        try {
            setLoading(true);
            const competitorData = (await getCompetitors()).data;
            const data: CompetitorFormData[] = await Promise.all(
                competitorData.map(async (value) => {
                    const bmcImage = (await getBMC(value.bmcId)).data.imageUrl;
                    return {
                        ...value,
                        bmcImage,
                    };
                })
            );
            setCompetitorList(data)
        } catch (error : any) {
            if(isAxiosError(error)){
                const response = error.response
                if(!response){
                    ShowToast("경쟁사 분석", '네트워크 오류가 발생헀습니다', ToastType.ERROR);
                } else {
                    const message = (response.data as ErrorResponse).message
                    if(message[message.length] === '.') {
                        const errorMsg = message.slice(0, -1);
                        ShowToast("경쟁사 분석", errorMsg, ToastType.ERROR);
                    }
                    ShowToast("경쟁사 분석", message, ToastType.ERROR);
                }
            }
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            initData()
            return () => {
                setCompetitorList([])
            }
        }, [])
    )
    return (
        <ImageBackground
            style={{flex : 1, position : 'relative'}} 
            source={backgroundImage}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                handleSubPress={async () => {
                    navigation.navigate('Select')
                }}
                title="내 경쟁사 분석"
                subIcon='Profile'
            />
            <FlashList
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal : 16, marginTop: 16   }}
                contentContainerStyle={{paddingVertical : 16}}
                data={competitorList}
                renderItem={(item) => renderItem(item)}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListEmptyComponent={() => (
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>{'존재하는\n 경쟁사 분석이 없습니다'}</Text>
                        </View>
                    ) : (
                        <View style={{
                            flex : 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Progress.Circle
                                color={Colors.primary}
                                size={40}
                                indeterminate={true}
                                thickness={300}
                            />
                        </View>
                    )
                )}
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
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
        gap : 6,
        paddingStart: 12
    },
    titleText: {
        marginTop : 16,
        fontSize: 16,
        fontFamily: Fonts.medium,
        marginRight : 16
    },
    subText: {
        fontSize: 15,
        fontFamily: Fonts.reqular,
        color: Colors.gray2,
    },
    myBMCBox: {
        backgroundColor: Colors.white1,
        borderRadius: 8,
        flexDirection: 'column',
        paddingBottom : 16,
        borderColor: Colors.white2,
        borderWidth: 2,
    },
    myBMCThumbnail: {
        paddingHorizontal: 8,
        paddingVertical :8,
        backgroundColor: Colors.white2,
        width: '100%',
        resizeMode: 'cover',
        height: 200,
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium,
        textAlign : 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
})
