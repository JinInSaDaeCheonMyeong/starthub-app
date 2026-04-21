import { StackScreenProps } from "@react-navigation/stack";
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useCallback, useEffect, useState } from "react";
import { BMCType, GetBMCsResponse } from "../../type/BMC/BMC.type";
import { getBMCs } from "../../api/bmc";
import { formatToDate } from "../../util/DateFormat";
import * as Progress from "react-native-progress"
import { BlurView } from "@react-native-community/blur";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { competitorAnalysis } from "../../api/competitor";
import { CompetitorRequest } from "../../type/competitor/competitor.type";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../type/util/response.type";
import BMCItem from "../../component/home/BMCItem";
import { DefaultImage } from "../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";

type SelectScreenProps = StackScreenProps<CompoetitorStackParamList, 'Select'>
const backgroundImage = DefaultImage.background

export default function SelectScreen({navigation} : SelectScreenProps){
    const [allBMCs, setAllBMCs] = useState<BMCType[]>([]);
    const [selectBMC, setSelectBMC] = useState<number | undefined>(undefined)
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false)

    const handleCompetitorRequest = async () => {
        if(!selectBMC) return
        setAnalyzing(true)
        try {
            const data : CompetitorRequest = {
                bmcId : selectBMC,
                searchKeywords : []
            }
            const response = (await competitorAnalysis(data)).data
            ShowToast("경쟁사 분석", '경쟁사 분석에 성공했습니다', ToastType.SUCCESS);
            const uri = allBMCs.filter((value) => {
                return value.id === selectBMC
            })[0].imageUrl
            navigation.navigate('Result', {image : {uri : uri, cache: 'force-cache'}, bmcId : selectBMC, data : response})
        } catch (error) {
            if(isAxiosError(error)){
                const response = error.response
                if(!response){
                    ShowToast("경쟁사 분석", '네트워크 오류가 발생했습니다', ToastType.ERROR);
                } else {
                    const message = (response.data as ErrorResponse).message
                    const displayMsg = message[message.length - 1] === '.' ? message.slice(0, -1) : message;
                    ShowToast("경쟁사 분석", displayMsg, ToastType.ERROR);
                }
            } else {
                ShowToast("경쟁사 분석", '알 수 없는 오류가 발생했습니다', ToastType.ERROR);
            }
        } finally {
            setAnalyzing(false)
        }
    }

    useEffect(() => {
        const fetchBMCs = async () => {
            try {
                const response: GetBMCsResponse = await getBMCs();
                setAllBMCs(response.data);
            } catch {
                ShowToast('오류 발생', 'BMC를 불러올 수 없습니다', ToastType.ERROR);
            } finally {
                setLoading(false);
            }
        };
        fetchBMCs();
        return () => {
            setAllBMCs([])
        };
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: BMCType }) => {
            const selected = item.id === selectBMC;
            return (
                <TouchableOpacity
                    onPress={() => setSelectBMC(selected ? undefined : item.id)}
                    style={[{
                        borderRadius : 8,
                        position : 'relative',
                    },
                    selected && { borderWidth: 2, borderColor: Colors.primary },
                    ]}
                >
                    <BMCItem
                        title={item.title}
                        subText={formatToDate(item.updatedAt, "dotted")}
                        imageSource={{ uri: item.imageUrl, cache: 'force-cache' }}
                        onPress={() => setSelectBMC(selected ? undefined : item.id)}
                    />
                </TouchableOpacity>
            );
        }, [selectBMC]
    );
    

    return (
        <>
        <ImageBackground 
            style={{flex : 1, position : 'relative'}} 
            source={backgroundImage}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                handleSubPress={async () => {
                    if(!selectBMC){
                        ShowToast('경쟁사 분석', 'BMC를 선택해주세요', ToastType.ERROR)
                        return
                    }
                    await handleCompetitorRequest()
                }}
                title="BMC 선택"
                subIcon="Profile"
            />
            <FlashList
                style={{flex : 1}}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{gap : 16, padding : 16}}
                data={allBMCs}
                renderItem={({item}) => renderItem({item})}
                ListEmptyComponent={() => (
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>존재하는 BMC가 없습니다.</Text>
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
        {analyzing && (
            <>
                <BlurView
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                    blurType='dark'
                    blurAmount={
                        Platform.select({
                            ios : 6,
                            android : Math.round(32 * 0.06)
                        })
                    }
                />
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <Progress.Circle
                        color={Colors.primary}
                        size={40}
                        indeterminate={true}
                        thickness={300}
                    />
                    <Text style={{ 
                        color: Colors.white1, 
                        marginTop: 16,
                        fontSize : 18,
                        fontFamily : Fonts.semiBold,
                        textAlign : 'center'
                    }}>
                        {"경쟁사 분석\n진행중"}
                    </Text>
                </View>
            </>
        )}
        </>
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
    },
    dateText: {
        fontSize: 14,
        fontFamily: Fonts.reqular,
        color: Colors.gray2,
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
})
