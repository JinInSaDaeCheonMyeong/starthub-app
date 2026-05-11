import { Alert, DimensionValue, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import GlassView from "../../GlassView";
import { DefaultImage } from "../../../constants/AppImages";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { CompetitorComparison } from "../../../type/competitor/competitor.type";
import HighlightedText from "./HighlightedText";
import { resultTextStyles } from "./ResultDataSection";

const defaultImage = DefaultImage.company;
const supportList = [0, 1, 2];

type CompetitorComparisonCarouselProps = {
    data: CompetitorComparison[];
    width: number;
    carouselHeight: DimensionValue;
    setCarouselHeight: Dispatch<SetStateAction<DimensionValue>>;
};

export default function CompetitorComparisonCarousel({
    data,
    width,
    carouselHeight,
    setCarouselHeight,
}: CompetitorComparisonCarouselProps) {
    return (
        <Carousel
            style={styles.carousel}
            width={width - 28}
            loop={false}
            height={typeof carouselHeight === "number" ? carouselHeight : 400}
            data={data}
            renderItem={({ item }) => (
                <CompetitorComparisonCard
                    item={item}
                    carouselHeight={carouselHeight}
                    setCarouselHeight={setCarouselHeight}
                />
            )}
        />
    );
}

function CompetitorComparisonCard({
    item,
    carouselHeight,
    setCarouselHeight,
}: {
    item: CompetitorComparison;
    carouselHeight: DimensionValue;
    setCarouselHeight: Dispatch<SetStateAction<DimensionValue>>;
}) {
    const [imageError, setImageError] = useState<boolean>(!item.logoUrl);

    return (
        <View
            style={styles.cardWrapper}
            onStartShouldSetResponder={() => false}
            onMoveShouldSetResponder={() => false}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setCarouselHeight((prev) => {
                    if (prev === "auto") return height;
                    if (typeof prev === "number" && height > prev) return height;
                    return prev;
                });
            }}
        >
            <GlassView containerStyle={[styles.card, { height: carouselHeight }]}>
                <View style={styles.companyHeader} onStartShouldSetResponder={() => false}>
                    <Image
                        style={styles.logo}
                        source={imageError ? defaultImage : { uri: item.logoUrl, cache: "force-cache" }}
                        onError={() => setImageError(true)}
                        placeholder={defaultImage}
                    />
                    <View style={styles.companyBody}>
                        <View style={styles.companyTitleRow}>
                            <Text style={styles.companyName}>{item.name}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert(
                                        "링크 열기",
                                        "외부 사이트로 이동하시겠습니까?",
                                        [
                                            { text: "취소", style: "cancel" },
                                            {
                                                text: "이동",
                                                onPress: () => Linking.openURL(item.websiteUrl),
                                            },
                                        ]
                                    );
                                }}
                            >
                                <Text style={styles.linkText}>바로가기</Text>
                            </TouchableOpacity>
                        </View>
                        <HighlightedText value={item.estimatedScale} />
                    </View>
                </View>
                <View style={styles.analysisBody}>
                    <View style={styles.marketShareSection}>
                        <Text style={resultTextStyles.boxTitle}>시장 점유율</Text>
                        <HighlightedText value={item.marketShare} />
                    </View>
                    <View style={styles.comparisonSection}>
                        <View style={styles.comparisonTitleRow}>
                            <Text style={[resultTextStyles.boxTitle, styles.flex]}>공통점</Text>
                            <Text style={[resultTextStyles.boxTitle, styles.flex]}>차이점</Text>
                        </View>
                        <View style={styles.comparisonRows}>
                            {supportList.map((value) => (
                                <View style={styles.comparisonRow} key={value}>
                                    <View style={styles.flex}>
                                        <HighlightedText value={item.similarities[value] ?? ""} />
                                    </View>
                                    <View style={styles.flex}>
                                        <HighlightedText value={item.differences[value] ?? ""} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </GlassView>
        </View>
    );
}

const styles = StyleSheet.create({
    carousel: {
        overflow: "visible",
    },
    cardWrapper: {
        marginRight: 8,
    },
    card: {
        padding: 16,
        gap: 16,
    },
    companyHeader: {
        flexDirection: "row",
        gap: 16,
        flexWrap: "wrap",
    },
    logo: {
        height: 88,
        width: 88,
        resizeMode: "cover",
        borderRadius: 8,
        backgroundColor: Colors.white1,
    },
    companyBody: {
        gap: 8,
        flex: 1,
    },
    companyTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    companyName: {
        color: Colors.black1,
        fontFamily: Fonts.semiBold,
        fontSize: 16,
        flex: 1,
    },
    linkText: {
        color: Colors.primary,
        fontSize: 14,
        fontFamily: Fonts.reqular,
        textDecorationLine: "underline",
    },
    analysisBody: {
        gap: 24,
    },
    marketShareSection: {
        gap: 4,
    },
    comparisonSection: {
        gap: 6,
    },
    comparisonTitleRow: {
        flexDirection: "row",
        gap: 16,
    },
    comparisonRows: {
        gap: 12,
    },
    comparisonRow: {
        flexDirection: "row",
        gap: 16,
    },
    flex: {
        flex: 1,
    },
});
