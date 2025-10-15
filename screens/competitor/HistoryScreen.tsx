import { StackScreenProps } from "@react-navigation/stack";
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import {useFocusEffect} from "@react-navigation/native"
import { useCallback, useState } from "react";
import { GetCompetitorsResponse } from "../../type/competitor/competitor.type";
import { getCompetitors } from "../../api/competitor";
import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import * as Progress from "react-native-progress"

type HistoryScreenProps = StackScreenProps<CompoetitorStackParamList>

export function HistoryScreen({navigation} : HistoryScreenProps) {
    const [competitorList, setCompetitorList] = useState<GetCompetitorsResponse['data']>([])
    const [loading, setLoading] = useState(true)
    const errorTitle = '경쟁사 분석'
    useFocusEffect(
        useCallback(() => {
            const initData = async () => {
                try {
                    setLoading(true);
                    const data = (await getCompetitors()).data;
                    setCompetitorList(data)
                } catch (error) {
                    if(isAxiosError(error)){
                        ShowToast(errorTitle, error.message, ToastType.ERROR)
                    }
                    ShowToast(errorTitle, '알 수 없는 오류가 발생했습니다', ToastType.ERROR)
                } finally {
                    setLoading(false)
                }
            }
            initData()
        }, [])
    )
    return (
        <ImageBackground
            style={{flex : 1, position : 'relative'}} 
            source={require("../../assets/images/glass-background.png")}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                handleSubPress={async () => {
                    navigation.navigate('Select')
                }}
                title="내 경쟁사 분석"
                subIcon='Profile'
            />
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal : 16}}
                contentContainerStyle={{gap : 16, paddingVertical : 16}}
                data={competitorList}
                renderItem={({item}) => {
                    console.log(item.bmcId, item.userBmc.title)
                    return (
                        <TouchableOpacity
                            style={{ position: 'relative' }}
                            onPress={() => {
                                navigation.navigate('Result', {bmcId : item.bmcId, image : '../../assets/images/bmc-thumbnail-exam.png', data : item})
                        }}>
                            <View style={{ borderRadius: 8, overflow: 'hidden' }}>
                                <View style={[styles.myBMCBox, { width: '100%' }]}>
                                    <View
                                    style={{
                                        backgroundColor: Colors.white2,
                                        borderTopLeftRadius: 8,
                                        borderTopRightRadius: 8,
                                    }}
                                        >
                                        <Image
                                            source={require('../../assets/images/bmc-thumbnail-exam.png')}
                                            style={styles.myBMCThumbnail}
                                        />
                                    </View>
                                    <View style={[styles.BMCContentContainer, { backgroundColor: Colors.white1 }]}>
                                        <View style={styles.BMCTextContainer}>
                                            <Text style={styles.titleText}>{item.userBmc.title}<Text style={styles.subText}> · 경쟁사 분석</Text></Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
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
                                size={50}
                                indeterminate={true}
                                thickness={300}
                                borderWidth={4}
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