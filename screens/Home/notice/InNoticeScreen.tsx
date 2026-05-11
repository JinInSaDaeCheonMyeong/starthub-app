import React from "react";
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SubHeaderBar from "../../../component/home/SubHeaderBar";
import { DefaultImage } from "../../../constants/AppImages";
import InNoticeHtmlContent from "../../../component/notice/InNoticeHtmlContent";
import InNoticeSummary from "../../../component/notice/InNoticeSummary";
import { noticeCategoryMeta } from "../../../component/notice/noticeCategoryMeta";
import useInNoticeScreen from "../../../hooks/home/notice/useInNoticeScreen";

type InNoticeScreenProps = NativeStackScreenProps<RootStackParamList, "InNotice">;

const backgroundImage = DefaultImage.background;

export default function InNoticeScreen({ navigation, route: { params } }: InNoticeScreenProps) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const {
        notice,
        source,
        meta: {
            periodLabel,
            targetAge,
            startupHistory,
        },
        ui: {
            isSelected,
            isBookmarkLoading,
            isSchedules,
            isScheduleLoading,
        },
        actions: {
            handleBookmarkToggle,
            handleSaveSchedules,
            handleOpenURL,
        },
    } = useInNoticeScreen(params);

    const categoryLabel = noticeCategoryMeta[notice.supportField as keyof typeof noticeCategoryMeta]?.label;

    return (
        <ImageBackground
            source={backgroundImage}
            style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <SubHeaderBar
                title={categoryLabel}
                handleBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <InNoticeSummary
                    notice={notice}
                    periodLabel={periodLabel}
                    targetAge={targetAge}
                    startupHistory={startupHistory}
                    isSelected={isSelected}
                    isBookmarkLoading={isBookmarkLoading}
                    isSchedules={isSchedules}
                    isScheduleLoading={isScheduleLoading}
                    onOpenURL={handleOpenURL}
                    onSaveSchedule={handleSaveSchedules}
                    onBookmarkToggle={handleBookmarkToggle}
                />
                <InNoticeHtmlContent
                    width={width}
                    source={source}
                    onOpenURL={handleOpenURL}
                />
                <View style={{ height: insets.bottom + 30 }} />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollView: {
        padding: 16,
    },
});
