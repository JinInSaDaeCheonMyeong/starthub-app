import { StackScreenProps } from "@react-navigation/stack";
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useEffect, useState } from "react";
import { BMCType, GetBMCsResponse } from "../../type/BMC/BMC.type";
import { getBMCs } from "../../api/bmc";
import { formatToDate } from "../../util/DateFormat";
import { Shadow } from "react-native-shadow-2";
import * as Progress from "react-native-progress"
import { BlurView } from "@react-native-community/blur";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { competitorAnalysis } from "../../api/competitor";
import { CompetitorRequest } from "../../type/competitor/competitor.type";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../type/util/response.type";
import BMCItem from "../../component/home/BMCItem";

type SelectScreenProps = StackScreenProps<CompoetitorStackParamList>

export default function SelectScreen({navigation} : SelectScreenProps){
    const [allBMCs, setAllBMCs] = useState<BMCType[]>([]);
    const [selectBMC, setSelectBMC] = useState<number | undefined>(undefined)
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false)

    const handleCompetitorRequest = async () => {
        setAnalyzing(true)
        if(!selectBMC) return
        try {
            const data : CompetitorRequest = {
                bmcId : selectBMC,
                searchKeywords : []
            }
            const response = (await competitorAnalysis(data)).data
            ShowToast("경쟁사 분석", '경쟁사 분석에 성공했습니다', ToastType.SUCCESS);
            navigation.navigate('Result', {image : require('../../assets/images/glass-background.png'), bmcId : selectBMC, data : response})
        } catch (error) {
            if(isAxiosError(error)){
                const response = error.response
                if(!response){
                    ShowToast("경쟁사 분석", '네트워크 오류가 발생하였습니다', ToastType.ERROR);
                } else {
                    const message = (response.data as ErrorResponse).message
                    if(message[message.length] === '.') {
                        const errorMsg = message.slice(0, -1);
                        ShowToast("경쟁사 분석", errorMsg, ToastType.ERROR);
                    }
                    ShowToast("경쟁사 분석", message + '입니다', ToastType.ERROR);
                }
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
            } catch (error) {
                console.error('BMC 데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBMCs();
    }, []);

    return (
        <>
        <ImageBackground 
            style={{flex : 1, position : 'relative'}} 
            source={require("../../assets/images/glass-background.png")}
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
            <FlatList
                style={{flex : 1}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{gap : 16, padding : 16}}
                data={allBMCs}
                renderItem={({ item }) => {
                    const selected = item.id === selectBMC;
                    
                    const content = (
                        <TouchableOpacity 
                            onPress={() => 
                                setSelectBMC(selected ? undefined : item.id)
                            }
                            style={[{
                                    borderRadius : 8,
                                    position : 'relative',
                                },
                                !selected && selectBMC !== undefined && {
                                    opacity : 0.5
                                }
                            ]}>
                            <BMCItem
                                title={item.title}
                                onPress={() => {setSelectBMC(selected ? undefined : item.id);}}
                                isCompetitor
                            />
                        </TouchableOpacity>
                    );
                    
                    return (
                        <View style={{ borderRadius : 8}}>
                            {content}
                        </View>
                    );
                }}
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
                        size={50}
                        indeterminate={true}
                        thickness={300}
                        borderWidth={4}
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