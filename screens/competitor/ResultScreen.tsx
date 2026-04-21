import { Alert, DimensionValue, ImageBackground, Linking, Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from 'expo-image';
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { Colors } from "../../constants/Color";
import GlassView from "../../component/GlassView";
import { Fonts } from "../../constants/Fonts";
import React, { useState } from "react";
import { CompetitorComparison, CompetitorResponse } from "../../type/competitor/competitor.type";
import Carousel from "react-native-reanimated-carousel";
import CommonButton from "../../component/CommonButton";
import { BlurView } from "@react-native-community/blur";
import * as Progress from "react-native-progress"
import { ShowToast, ToastType } from "../../util/ShowToast";
import { isAxiosError } from "axios";
import { recompetitorAnalysis } from "../../api/competitor";
import { DefaultImage } from "../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";

type ResultScreenProps = StackScreenProps<CompoetitorStackParamList, 'Result'>
const defaultBMCImage = DefaultImage.bmc
const defaultImage = DefaultImage.company
const backgroundImage = DefaultImage.background

export default function ResultScreen({navigation, route : {params}} : ResultScreenProps){
    const {width} = useWindowDimensions()
    const [carouselHeight, setCarouselHeight] = useState<DimensionValue>('auto');
    const supportList = [0, 1, 2]
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<CompetitorResponse['data'] | undefined>(params?.data)
    const [imageError, setImageError] = useState<boolean>(!params?.image);

    const handleCompetitorRequest = async () => {
        setLoading(true)
        if(!params?.bmcId) {
            setLoading(false) 
            return
        }
        try {
            const response = (await recompetitorAnalysis(params.bmcId)).data
            ShowToast("경쟁사 분석", '경쟁사 분석에 성공했습니다', ToastType.SUCCESS);
            setForm(response)
        } catch (error) {
            if(isAxiosError(error)){
                const response = error.response
                if(!response){
                    ShowToast("경쟁사 분석", '네트워크 오류가 발생했습니다', ToastType.ERROR);
                } else {
                    ShowToast("경쟁사 분석", response.data, ToastType.ERROR);
                }
            }
            ShowToast("경쟁사 분석", '알 수 없는 오류가 발생했습니다', ToastType.ERROR);
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
                    loop={false}   // ← 무한 스크롤 방지
                    height={typeof carouselHeight === 'number' ? carouselHeight : 400}
                    data={body as CompetitorComparison[]}
                    renderItem={({index, item}) => {
                        const [imageError, setImageError] = useState<boolean>(!item.logoUrl)
                        return (
                        <View 
                            style={{marginRight : 8}}
                            onStartShouldSetResponder={() => false}
                            onMoveShouldSetResponder={() => false}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                
                                setCarouselHeight(prev => {
                                    // 처음엔 무조건 세팅
                                    if (prev === 'auto') return height;
                                    // 더 큰 높이만 갱신
                                    if (typeof prev === 'number' && height > prev) return height;
                                    return prev;
                                });
                            }}
                        >
                            <GlassView 
                                containerStyle={{padding : 16, gap : 16, height : carouselHeight}}
                                key={index}
                            >
                                <View 
                                    style={{flexDirection : 'row', gap : 16, flexWrap : 'wrap'}}
                                    onStartShouldSetResponder={() => false}
                                >
                                    <Image 
                                        style={{
                                            height : 88, 
                                            width : 88, 
                                            resizeMode : 'cover', 
                                            borderRadius : 8, 
                                            backgroundColor : Colors.white1
                                        }} 
                                        source={imageError ? defaultImage : {uri : item.logoUrl, cache: 'force-cache'}}
                                        onError={() => setImageError(true)}
                                        placeholder={defaultImage}
                                    />
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
            )   
        }
    </View>
);


    const renderUserBMC = () => (
        <>
            <View style={[styles.bmcImage, {marginHorizontal : 16}]}>
                <Image
                    source={
                        imageError || !params?.image
                            ? defaultBMCImage
                            : params.image
                    }
                    contentFit="contain"
                    placeholder={defaultBMCImage}
                    style={styles.bmcImage}
                    onError={() => setImageError(true)}
                />
                {imageError && (
                    <View style={styles.dummyOverlay}>
                        <Text style={styles.dummyText}>이미지가 없습니다</Text>
                    </View>
                )}
            </View>
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
    const sections = [
        { key: 'bmc', render: renderUserBMC },
        { key: 'userScale', render: renderUserScale },
        { key: 'strength', render: renderStrength },
        { key: 'weakness', render: renderWeakeness },
        { key: 'globalExpansion', render: renderGlobalExpansionStrategy },
    ];
    return (
        <>
        <ImageBackground
            style={{flex : 1, position : 'relative'}} 
            source={backgroundImage}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                title="경쟁사 분석 결과"
            />
            <FlashList
                data={sections}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => item.render()}
                contentContainerStyle={{ gap: 20, paddingVertical: 16 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            />
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
            )
        }
        </>
    )
}

const styles = StyleSheet.create({
    bmcImage : {
        width: 'auto',
        height : 250,
        backgroundColor : Colors.white1,
        borderWidth : 1,
        borderColor : Colors.gray4,
        marginBottom : 16
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
        marginHorizontal : 16,
        marginTop : 24
    },
    dummyOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dummyText: {
        color: Colors.gray2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
})
