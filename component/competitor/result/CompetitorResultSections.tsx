import { DimensionValue, ImageURISource, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Image } from "expo-image";
import GlassView from "../../GlassView";
import { DefaultImage } from "../../../constants/AppImages";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { CompetitorResponse } from "../../../type/competitor/competitor.type";
import CompetitorComparisonCarousel from "./CompetitorComparisonCarousel";
import { ResultDataSection, ResultDataWrap, resultTextStyles } from "./ResultDataSection";

const defaultBMCImage = DefaultImage.bmc;

type CompetitorResultSectionsProps = {
    form?: CompetitorResponse["data"];
    image?: ImageURISource;
    carouselHeight: DimensionValue;
    setCarouselHeight: Dispatch<SetStateAction<DimensionValue>>;
};

export type CompetitorResultSection = {
    key: string;
    render: () => React.ReactElement | null;
};

export function useCompetitorResultSections({
    form,
    image,
    carouselHeight,
    setCarouselHeight,
}: CompetitorResultSectionsProps): CompetitorResultSection[] {
    const { width } = useWindowDimensions();
    const [imageError, setImageError] = useState<boolean>(!image);

    return [
        {
            key: "bmc",
            render: () => (
                <>
                    <View style={[styles.bmcImageWrapper, styles.horizontalMargin]}>
                        <Image
                            source={imageError || !image ? defaultBMCImage : image}
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
                    <ResultDataSection title="서비스 개요">
                        <ResultDataWrap title="서비스명" body={form?.userBmc.title} />
                        <ResultDataWrap title="핵심 가치 제안" body={form?.userBmc.valueProposition} />
                        <ResultDataWrap title="목표 고객" body={form?.userBmc.targetCustomer} />
                        <ResultDataWrap title="핵심 강점 목록" body={form?.userBmc.keyStrengths} />
                    </ResultDataSection>
                </>
            ),
        },
        {
            key: "userScale",
            render: () => (
                <ResultDataSection title="사용자 규모">
                    <ResultDataWrap title="추정 사용자 기반" body={form?.userScale.estimatedUserBase} />
                    <ResultDataWrap title="시장 포지션" body={form?.userScale.marketPosition} />
                    <View style={styles.dataWrap}>
                        <Text style={resultTextStyles.boxTitle}>경쟁사 비교</Text>
                        <CompetitorComparisonCarousel
                            data={form?.userScale.competitorComparison ?? []}
                            width={width}
                            carouselHeight={carouselHeight}
                            setCarouselHeight={setCarouselHeight}
                        />
                    </View>
                </ResultDataSection>
            ),
        },
        {
            key: "strength",
            render: () => (
                <ResultDataSection title="서비스 강점">
                    <ResultDataWrap title="경쟁 우위" body={form?.strengths.competitiveAdvantages} />
                    <ResultDataWrap title="가치 제안" body={form?.strengths.uniqueValuePropositions} />
                    <ResultDataWrap title="시장 기회" body={form?.strengths.marketOpportunities} />
                    <ResultDataWrap title="전략 제안" body={form?.strengths.strategicRecommendations} />
                </ResultDataSection>
            ),
        },
        {
            key: "weakness",
            render: () => (
                <ResultDataSection title="서비스 약점">
                    <ResultDataWrap title="경쟁 열세" body={form?.weaknesses.competitiveDisadvantages} />
                    <ResultDataWrap title="도전 과제" body={form?.weaknesses.marketChallenges} />
                    <ResultDataWrap title="제한 자원" body={form?.weaknesses.resourceLimitations} />
                    <ResultDataWrap title="개선 제안" body={form?.weaknesses.improvementAreas} />
                </ResultDataSection>
            ),
        },
        {
            key: "globalExpansion",
            render: () => (
                <ResultDataSection title="글로벌 확장 전략" showDivider={false}>
                    <ResultDataWrap title="우선 진출 시장" body={form?.globalExpansionStrategy.priorityMarkets} />
                    <ResultDataWrap title="진입 전략" body={form?.globalExpansionStrategy.entryStrategies} />
                    <ResultDataWrap title="현지화 요구사항" body={form?.globalExpansionStrategy.localizationRequirements} />
                    <ResultDataWrap title="파트너십 기회" body={form?.globalExpansionStrategy.partnershipOpportunities} />
                    <ResultDataWrap title="예상 도전 과제" body={form?.globalExpansionStrategy.expectedChallenges} />
                </ResultDataSection>
            ),
        },
    ];
}

const styles = StyleSheet.create({
    horizontalMargin: {
        marginHorizontal: 16,
    },
    bmcImageWrapper: {
        width: "auto",
        height: 250,
        backgroundColor: Colors.white1,
        borderWidth: 1,
        borderColor: Colors.gray4,
        marginBottom: 16,
    },
    bmcImage: {
        width: "auto",
        height: 250,
        backgroundColor: Colors.white1,
        borderWidth: 1,
        borderColor: Colors.gray4,
        marginBottom: 16,
    },
    dummyOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    dummyText: {
        color: Colors.gray2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    dataWrap: {
        gap: 12,
    },
});
