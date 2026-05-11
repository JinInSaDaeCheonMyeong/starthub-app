import { Alert, DimensionValue, ImageBackground, StyleSheet, View } from "react-native";
import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { isAxiosError } from "axios";
import GlassView from "../../component/GlassView";
import CommonButton from "../../component/CommonButton";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import CompetitorResultLoadingOverlay from "../../component/competitor/result/CompetitorResultLoadingOverlay";
import {
    CompetitorResultSection,
    useCompetitorResultSections,
} from "../../component/competitor/result/CompetitorResultSections";
import { DefaultImage } from "../../constants/AppImages";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import { recompetitorAnalysis } from "../../api/competitor";
import { CompetitorResponse } from "../../type/competitor/competitor.type";
import { ShowToast, ToastType } from "../../util/ShowToast";
import ListEmptyState from "../../component/ListEmptyState";

type ResultScreenProps = NativeStackScreenProps<CompoetitorStackParamList, "Result">;

const backgroundImage = DefaultImage.background;

export default function ResultScreen({ navigation, route: { params } }: ResultScreenProps) {
    const [carouselHeight, setCarouselHeight] = useState<DimensionValue>("auto");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<CompetitorResponse["data"] | undefined>(params?.data);

    const sections = useCompetitorResultSections({
        form,
        image: params?.image,
        carouselHeight,
        setCarouselHeight,
    });

    const handleCompetitorRequest = async () => {
        setLoading(true);
        if (!params?.bmcId) {
            setLoading(false);
            return;
        }

        try {
            const response = (await recompetitorAnalysis(params.bmcId)).data;
            ShowToast("경쟁사 분석", "경쟁사 분석에 성공했습니다", ToastType.SUCCESS);
            setForm(response);
        } catch (error) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("경쟁사 분석", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                } else {
                    ShowToast("경쟁사 분석", response.data, ToastType.ERROR);
                }
            } else {
                ShowToast("경쟁사 분석", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmCompetitorRequest = () => {
        Alert.alert(
            "경쟁사 재분석",
            "기존 분석 결과가 \n사라질 수 있습니다.\n계속 진행하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "진행",
                    onPress: handleCompetitorRequest,
                },
            ]
        );
    };

    return (
        <>
            <ImageBackground style={styles.background} source={backgroundImage}>
                <SubHeaderBar
                    handleBackPress={() => navigation.goBack()}
                    title="경쟁사 분석 결과"
                />
                <FlashList
                    data={sections}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }: { item: CompetitorResultSection }) => item.render()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    ListEmptyComponent={
                        <ListEmptyState
                            message="분석 결과 항목이 없습니다."
                            style={styles.emptyState}
                        />
                    }
                />
                <GlassView blurPercent={0.06} containerStyle={styles.bottomBar}>
                    <View style={styles.buttonWrapper}>
                        <CommonButton
                            title="다시하기"
                            onPress={confirmCompetitorRequest}
                            disabled={false}
                        />
                    </View>
                </GlassView>
            </ImageBackground>
            {loading ? <CompetitorResultLoadingOverlay /> : null}
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        position: "relative",
    },
    listContent: {
        gap: 20,
        paddingVertical: 16,
    },
    emptyState: {
        minHeight: 240,
    },
    bottomBar: {
        padding: 16,
        paddingVertical: 12,
        borderWidth: 0,
        borderRadius: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    buttonWrapper: {
        flex: 1,
    },
});
