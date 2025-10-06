import { Alert, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from "react-native";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { Colors } from "../../constants/Color";
import GlassView from "../../component/GlassView";
import { Fonts } from "../../constants/Fonts";
import React, { Children, ReactNode, useState } from "react";
import { CompetitorAnalysisData, CompetitorComparison } from "../../type/competitor/competitor.type";
import Carousel from "react-native-reanimated-carousel";

type ResultScreenProps = StackScreenProps<CompoetitorStackParamList>

export default function ResultScreen({navigation, route : {params}} : ResultScreenProps){
    const {width} = useWindowDimensions()
    const [carouselHeight, setCarouselHeight] = useState(400);
    const supportList = [0, 1, 2]

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
                width={width - 32}
                height={carouselHeight}
                data={body as CompetitorComparison[]}
                renderItem={({index, item}) => {
                    return (
                    <View 
                        onLayout={(event) => {
                            const {height} = event.nativeEvent.layout;
                            if (height > carouselHeight) {
                                setCarouselHeight(height);
                            }
                        }}
                    >
                    <GlassView 
                        containerStyle={{padding : 16, gap : 16}}
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
                source={params?.image ?? require('../../assets/images/glass-background.png')}
                style={styles.bmcImage} 
            />
            {createDataContainer('서비스 개요', 
                createDataBox(
                    <>
                        {createDataWrap("서비스명", params?.data.userBmc.title ?? '')}
                        {createDataWrap("핵심 가치 제안", params?.data.userBmc.valueProposition ?? '')}
                        {createDataWrap("목표 고객", params?.data.userBmc.targetCustomer ?? '')}
                        {createDataWrap("핵심 강점 목록", params?.data.userBmc.keyStrengths ?? '')}
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
                        {createDataWrap("추정 사용자 기반", params?.data.userScale.estimatedUserBase ?? '')}
                        {createDataWrap("시장 포지션", params?.data.userScale.marketPosition ?? '')}
                        {createDataWrap("성장 잠재력", params?.data.userScale.growthPotential ?? '')}
                        {createDataWrap("경쟁사 비교", params?.data.userScale.competitorComparison ?? '')}
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
                        {createDataWrap("경쟁 우위", params?.data.strengths.competitiveAdvantages ?? '')}
                        {createDataWrap("가치 제안", params?.data.strengths.uniqueValuePropositions ?? '')}
                        {createDataWrap("시장 기회", params?.data.strengths.marketOpportunities ?? '')}
                        {createDataWrap("전략 제안", params?.data.strengths.strategicRecommendations ?? '')}
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
                        {createDataWrap("경쟁 열세", params?.data.weaknesses.competitiveDisadvantages ?? '')}
                        {createDataWrap("도전 과제", params?.data.weaknesses.marketChallenges ?? '')}
                        {createDataWrap("제한 자원", params?.data.weaknesses.resourceLimitations ?? '')}
                        {createDataWrap("개선 제안", params?.data.weaknesses.improvementAreas ?? '')}
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
                        {createDataWrap("우선 진출 시장", params?.data.globalExpansionStrategy.priorityMarkets ?? '')}
                        {createDataWrap("진입 전략", params?.data.globalExpansionStrategy.entryStrategies ?? '')}
                        {createDataWrap("현지화 요구사항", params?.data.globalExpansionStrategy.localizationRequirements ?? '')}
                        {createDataWrap("파트너십 기회", params?.data.globalExpansionStrategy.partnershipOpportunities ?? '')}
                        {createDataWrap("예상 도전 과제", params?.data.globalExpansionStrategy.expectedChallenges ?? '')}
                    </>
                )
            )}
        </>
    )

    return (
        <ImageBackground
            style={{flex : 1, position : 'relative'}} 
            source={require("../../assets/images/glass-background.png")}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                title="경쟁사 분석 결과"
            />
            <ScrollView  
                style={{paddingVertical : 16}}
                contentContainerStyle={{gap : 20}} 
                showsVerticalScrollIndicator={false}
            >
                {renderUserBMC()}
                {renderUserScale()}
                {renderStrength()}
                {renderWeakeness()}
                {renderGlobalExpansionStrategy()}
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    bmcImage : {
        paddingHorizontal: 8,
        paddingVertical :8,
        backgroundColor: Colors.white2,
        width: 'auto',
        resizeMode: 'cover',
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