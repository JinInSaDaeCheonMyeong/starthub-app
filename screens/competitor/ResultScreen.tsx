import { Alert, ImageBackground, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from "react-native";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { Colors } from "../../constants/Color";
import GlassView from "../../component/GlassView";
import { Fonts } from "../../constants/Fonts";
import React, { useState } from "react";
import { CompetitorComparison, CompetitorRequest, CompetitorResponse } from "../../type/competitor/competitor.type";
import Carousel from "react-native-reanimated-carousel";
import CommonButton from "../../component/CommonButton";
import DownloadIcon from "../../assets/icons/download.svg"
import { BlurView } from "@react-native-community/blur";
import * as Progress from "react-native-progress"
import { ShowToast, ToastType } from "../../util/ShowToast";
import { ErrorResponse } from "../../type/util/response.type";
import { isAxiosError } from "axios";
import { competitorAnalysis } from "../../api/competitor";

type ResultScreenProps = StackScreenProps<CompoetitorStackParamList>

export default function ResultScreen({navigation, route : {params}} : ResultScreenProps){
    const {width} = useWindowDimensions()
    const [carouselHeight, setCarouselHeight] = useState(400);
    const supportList = [0, 1, 2]
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<CompetitorResponse['data'] | undefined>(params?.data)

    const handleCompetitorRequest = async () => {
        setLoading(true)
        if(!params?.bmcId) {
            setLoading(false) 
            return
        }
        try {
            const data : CompetitorRequest = {
                bmcId : params.bmcId,
                searchKeywords : []
            }
            const response = (await competitorAnalysis(data)).data
            ShowToast("경쟁사 분석", '경쟁사 분석에 성공했습니다', ToastType.SUCCESS);
            setForm(response)
        } catch (error) {
            if(isAxiosError(error)){
                const response = error.response
                if(!response){
                    ShowToast("경쟁사 분석", '네트워크 오류가 발생했습니다', ToastType.ERROR);
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
            setLoading(false)
        }
    }

    const setHighlight = (value: string) => {
        if (!value) return <Text>값이 존재하지 않습니다</Text>;
        
        const parts = value.split(/(<<.*?>>)/g);
        
        return (
            <Text style={styles.wrapText}>
            {parts.map((part, index) => {
                const match = part.match(/<<(.*?)>>/);
                if (match) {
                return (
                    <Text
                    key={index}
                    style={[
                        styles.wrapText,
                        { fontFamily: Fonts.semiBold, color: Colors.primary },
                    ]}
                    >
                    {match[1]}
                    </Text>
                );
                } else {
                return (
                    <Text key={index} style={styles.wrapText}>
                    {part}
                    </Text>
                );
                }
            })}
            </Text>
        );
    };

    const createDataContainer = (title: string, children: React.ReactNode) => (
        <View style={styles.dataContainer}>
            <Text style={styles.containerTitle}>{title}</Text>
            {children}
        </View>
    );

    const createDataBox = (children : React.ReactNode) => (
        <View style={styles.dataBox}>
            {children}
        </View>
    )

    const createDataWrap = (
        title: string,
        body: string | string[] | CompetitorComparison[]
    ) => (
    <View style={styles.dataWrap}>
        <Text style={styles.boxTitle}>{title}</Text>
        {typeof body === "string" ? (
        <GlassView containerStyle={styles.glassView}>{setHighlight(body)}</GlassView>
        ) : Array.isArray(body) && typeof body[0] === "string" ? (
        (body as string[]).map((value, index) => (
            <GlassView key={index} containerStyle={styles.glassView}>
                {setHighlight(value)}
            </GlassView>
        ))
        ) : (
            <Carousel
                style={{overflow : 'visible'}}
                width={width - 28}
                height={carouselHeight}
                data={body as CompetitorComparison[]}
                renderItem={({index, item}) => {
                    return (
                    <View 
                        style={{marginRight : 8}}
                        onLayout={(event) => {
                            const {height} = event.nativeEvent.layout;
                            if (height > carouselHeight) {
                                setCarouselHeight(height);
                            }
                        }}
                    >
                        <GlassView 
                            containerStyle={{padding : 16, gap : 16, height : carouselHeight}}
                            key={index}
                        >
                            <View style={{flexDirection : 'row', gap : 16}}>
                                <Image style={{height : 88, width : 88, resizeMode : 'center', borderRadius : 8, backgroundColor : Colors.white2}} src={item.logoUrl}/>
                                <View style={{gap : 8, flex : 1}}>
                                    <View style={{flexDirection : 'row', justifyContent : 'space-between', gap : 8}}>
                                        <Text style={{
                                            color : Colors.black1,
                                            fontFamily : Fonts.semiBold,
                                            fontSize : 16,
                                            flex : 1
                                        }}>
                                            {item.name}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                Alert.alert(
                                                    "링크 열기",
                                                    "외부 사이트로 이동하시겠습니까?",
                                                    [
                                                        { text: "취소", style: "cancel" },
                                                        {
                                                            text: "이동",
                                                            onPress: () => Linking.openURL(item.websiteUrl)
                                                        }
                                                    ]
                                                );
                                            }}
                                        >
                                            <Text style={{
                                                color : Colors.primary,
                                                fontSize : 14,
                                                fontFamily : Fonts.reqular,
                                                textDecorationLine : 'underline'
                                            }}>
                                                바로가기
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {setHighlight(item.estimatedScale)}
                                </View>
                            </View>
                            <View style={{gap : 24}}>
                                <View style={{gap : 4}}>
                                    <Text style={styles.boxTitle}>시장 점유율</Text>
                                    {setHighlight(item.marketShare)}
                                </View>
                                <View style={{gap : 6}}>
                                    <View style={{flexDirection : 'row', gap : 16}}>
                                        <Text style={[styles.boxTitle, {flex : 1}]}>공통점</Text>
                                        <Text style={[styles.boxTitle, {flex : 1}]}>차이점</Text>
                                    </View>
                                    <View style={{gap : 12}}>
                                        {supportList.map((value) => (
                                            <View style={{flexDirection : 'row', gap : 16}} key={value}>
                                                <View style={{flex : 1}}>
                                                    {setHighlight(item.similarities[value] ?? '')}
                                                </View>
                                                <View style={{flex : 1}}>
                                                    {setHighlight(item.differences[value] ?? '')}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </GlassView>
                    </View>
                )}}
            />
        )}
    </View>
    );


    const renderUserBMC = () => (
        <>
            <Image 
                source={require('../../assets/images/bmc-thumbnail-exam.png')}
                style={[styles.bmcImage, {
                    height : 245 * width / 361
                }]} 
            />
            {createDataContainer('서비스 개요', 
                createDataBox(
                    <>
                        {createDataWrap("서비스명", form?.userBmc.title ?? '')}
                        {createDataWrap("핵심 가치 제안", form?.userBmc.valueProposition ?? '')}
                        {createDataWrap("목표 고객", form?.userBmc.targetCustomer ?? '')}
                        {createDataWrap("핵심 강점 목록", form?.userBmc.keyStrengths ?? '')}
                    </>
                )
            )}
            <View style={styles.divider}/>
        </>
    )

    const renderUserScale = () => (
        <>
            {createDataContainer('사용자 규모', 
                createDataBox(
                    <>
                        {createDataWrap("추정 사용자 기반", form?.userScale.estimatedUserBase ?? '')}
                        {createDataWrap("시장 포지션", form?.userScale.marketPosition ?? '')}
                        {createDataWrap("경쟁사 비교", form?.userScale.competitorComparison ?? '')}
                    </>
                )
            )}
            <View style={styles.divider}/>
        </>
    )

    const renderStrength = () => (
        <>
            {createDataContainer('서비스 강점', 
                createDataBox(
                    <>
                        {createDataWrap("경쟁 우위", form?.strengths.competitiveAdvantages ?? '')}
                        {createDataWrap("가치 제안", form?.strengths.uniqueValuePropositions ?? '')}
                        {createDataWrap("시장 기회", form?.strengths.marketOpportunities ?? '')}
                        {createDataWrap("전략 제안", form?.strengths.strategicRecommendations ?? '')}
                    </>
                )
            )}
            <View style={styles.divider}/>
        </>
    )

    const renderWeakeness = () => (
        <>
            {createDataContainer('서비스 약점', 
                createDataBox(
                    <>
                        {createDataWrap("경쟁 열세", form?.weaknesses.competitiveDisadvantages ?? '')}
                        {createDataWrap("도전 과제", form?.weaknesses.marketChallenges ?? '')}
                        {createDataWrap("제한 자원", form?.weaknesses.resourceLimitations ?? '')}
                        {createDataWrap("개선 제안", form?.weaknesses.improvementAreas ?? '')}
                    </>
                )
            )}
            <View style={styles.divider}/>
        </>
    )

    const renderGlobalExpansionStrategy = () => (
        <>
            {createDataContainer('글로벌 확장 전략', 
                createDataBox(
                    <>
                        {createDataWrap("우선 진출 시장", form?.globalExpansionStrategy.priorityMarkets ?? '')}
                        {createDataWrap("진입 전략", form?.globalExpansionStrategy.entryStrategies ?? '')}
                        {createDataWrap("현지화 요구사항", form?.globalExpansionStrategy.localizationRequirements ?? '')}
                        {createDataWrap("파트너십 기회", form?.globalExpansionStrategy.partnershipOpportunities ?? '')}
                        {createDataWrap("예상 도전 과제", form?.globalExpansionStrategy.expectedChallenges ?? '')}
                    </>
                )
            )}
        </>
    )

    return (
        <>
        <ImageBackground
            style={{flex : 1, position : 'relative'}} 
            source={require("../../assets/images/glass-background.png")}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                title="경쟁사 분석 결과"
            />
            <ScrollView
                contentContainerStyle={{gap : 20, paddingVertical : 16}} 
                showsVerticalScrollIndicator={false}
            >
                {renderUserBMC()}
                {renderUserScale()}
                {renderStrength()}
                {renderWeakeness()}
                {renderGlobalExpansionStrategy()}
            </ScrollView>
            <GlassView
                blurPercent={0.06}
                containerStyle={{
                    padding : 16,
                    paddingVertical : 12,
                    borderWidth : 0,
                    borderRadius : 0,
                    flexDirection : 'row',
                    justifyContent : 'space-between',
                    gap : 12
                }}
            >
                <View style={{flex :1}}>
                    <CommonButton 
                        title="다시하기" 
                        onPress={() => {
                            Alert.alert(
                                "경쟁사 재분석",
                                "기존 분석 결과가 \n사라질 수 있습니다.\n계속 진행하시겠습니까?",
                                [
                                    { text: "취소", style: "cancel" },
                                    {
                                        text: "진행",
                                        onPress: () => handleCompetitorRequest()
                                    }
                                ]
                            );
                        }}
                        disabled={false}
                    />
                </View>
                <TouchableOpacity 
                    style={{
                        padding : 20,
                        borderWidth : 2,
                        borderRadius : 8,
                        borderColor : Colors.primary,
                        alignItems : 'center',
                        justifyContent : 'center'
                    }} 
                    onPress={() => {}}
                >
                    <DownloadIcon fill={Colors.primary} width={20} height={20}/>
                </TouchableOpacity>
            </GlassView>
        </ImageBackground>
        {
            loading && (
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
            )
        }
        </>
    )
}

const styles = StyleSheet.create({
    bmcImage : {
        width: 'auto',
        resizeMode: 'stretch',
        backgroundColor : Colors.white1,
        borderWidth : 1,
        borderColor : Colors.gray4,
        height: 245,
        marginHorizontal : 16
    },
    dataContainer : {
        gap : 12,
        marginHorizontal : 16
    },
    dataBox : {
        gap : 24
    },
    dataWrap : {
        gap : 12
    },
    glassView : {
        padding : 16
    },
    containerTitle : {
        fontSize : 18,
        fontFamily : Fonts.semiBold,
        color : Colors.black1
    },
    boxTitle : {
        fontSize : 16,
        fontFamily : Fonts.medium,
        color : Colors.black1
    },
    wrapText : {
        fontFamily : Fonts.reqular, 
        color : Colors.black1, 
        fontSize : 14,
    },
    divider : {
        borderBottomWidth : 1, 
        borderColor : Colors.gray3,
        marginHorizontal : 16
    }
})