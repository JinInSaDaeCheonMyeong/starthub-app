import { FlatList, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { Shadow } from "react-native-shadow-2";
import BMCNote from "../../assets/icons/bmc_note.svg";
import NoticeItem from "../../component/notice/NoticeItem";
import { NoticeItemList } from "../../constants/NoticeItemList";
import RecruitsItem from "../../component/notice/RecruitsItem";
import ImminentView from "../../component/home/ImminentView";
import { RecruitsItemType } from "../../type/notice/recruits.type";
import { NoticeItemType } from "../../type/notice/notice.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/core";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { isAxiosError } from "axios";
import { getRecruitsList } from "../../api/recruits";
import { notice } from "../../api/notice";
import { ErrorResponse } from "../../type/util/response.type";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../../navigation/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { BMCDummyData } from "../../constants/dummy/BMCDummy";
import Carousel from "react-native-reanimated-carousel";

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    StackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [noticeItems, setNoticeItems] = useState<NoticeItemType[]>([]);

    const fetchNoticeItems = async () => {
        try {
        const response = await notice(1, "", "", "", "", "", "");
        setNoticeItems(response); // data 구조에 따라 조정
        } catch (error: unknown) {
        if (isAxiosError(error)) {
            const response = error.response;
            if (!response) {
            ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
            return;
            }
            const errorData = response.data as ErrorResponse;
            ShowToast("오류 발생", errorData.message, ToastType.ERROR);
            return;
        }
        ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        }
    };

    // 날짜 차이(밀리초) 절댓값 계산 함수
    const getClosestNotice = (items: NoticeItemType[]): NoticeItemType | null => {
    if (items.length === 0) return null;

    const now = new Date();

    const BMCData = BMCDummyData[0].thumbnail

    // endTime이 문자열이라 Date로 변환 필요
    return items.reduce((prev, curr) => {
        const prevDate = new Date(prev.endTime);
        const currDate = new Date(curr.endTime);

        const prevDiff = Math.abs(prevDate.getTime() - now.getTime());
        const currDiff = Math.abs(currDate.getTime() - now.getTime());

        return currDiff < prevDiff ? curr : prev;
    });
    };


    function goWeb(link: string) {
        const handlePress = () => {
            Linking.openURL(link);
        }; handlePress()
    }
    const {width, height} = useWindowDimensions()
    const data = ["배너1", "배너2", "배너3"];

    useFocusEffect(
        useCallback(() => {
            fetchNoticeItems();
        }, [])
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.flatListContainer]}>
                <Carousel
                    loop
                    width={width}
                    height={height * 0.18}
                    autoPlay
                    data={data}
                    autoPlayInterval={5000}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor : Colors.primary,
                                marginHorizontal : 16,
                                borderRadius : 16
                            }}
                        >
                            <Text style={{ fontSize: 24, color: "#fff" }}>{item}</Text>
                        </View>
                    )}
                />
                <View style={{gap : 6}}>
                    <Text style={styles.titleText}>맞춤 추천 공고</Text>
                    <Text style={styles.captionText}>사용자님의 관심을 분석하여 제공해 드려요</Text>
                </View>
                <FlatList
                    contentContainerStyle={{ gap: 16, paddingHorizontal: 16,}}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    onEndReached={() => {}}
                    style={{ overflow: "visible" }}
                    data={noticeItems.length > 0 ? noticeItems : NoticeItemList}
                    renderItem={({ item }) => (
                    <NoticeItem
                        webLink={item.webLink}
                        id={item.id}
                        category={item.category}
                        title={item.title}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        location={item.location}
                        years={item.years}
                        target={item.target}
                        entre={item.entre}
                        isHome={true}
                        onPress={() => {
                            goWeb(item.webLink)
                        }}
                    />
                    )}
                />
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.white1,
        gap: 16,
    },
    BMCContainer: {
        backgroundColor: Colors.white1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        padding : 16,
        gap: 12,
    },
    flatListContainer: {
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    BMCText: {
        color: Colors.black2,
        fontFamily: Fonts.semiBold,
        flex: 1,
        fontSize: 16,
        flexShrink: 1,
    },
    titleText: {
        fontSize: 18,
        marginStart: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.black2,
    },
    captionText: {
        fontSize: 14,
        marginStart: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.gray2,
    },
});
