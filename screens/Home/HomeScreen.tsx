import { FlatList, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    StackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [noticeItems, setNoticeItems] = useState<NoticeItemType[]>([]);
    const [recruitsItems, setRecruitsItems] = useState<RecruitsItemType[]>([]);

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

    const getRecruitsItems = async (reset: boolean = false) => {
        try {
        const response = (await getRecruitsList(0, 10)).data;

        if (reset) {
            setRecruitsItems(response.content);
        } else {
            const map = new Map(recruitsItems.map((item) => [item.id, item]));
            response.content.forEach((item) => {
            map.set(item.id, item); // 덮어쓰기
            });
            const updatedList = Array.from(map.values());
            setRecruitsItems(updatedList);
        }
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

    const closestNotice = getClosestNotice(noticeItems);

    useFocusEffect(
        useCallback(() => {
        fetchNoticeItems();
        getRecruitsItems(true);
        }, [])
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ImminentView
                title={closestNotice ? closestNotice.title : "마감 임박 공고가 없습니다."}
                onPress={() => {
                    closestNotice ? goWeb(closestNotice.webLink) : ShowToast("오류 발생", "공고가 존재하지 않습니다", ToastType.ERROR)
                }}
            />
            <View style={{ height: 16 }} />
            <View style={commonContainer.container}>
            <TouchableOpacity 
                onPress={() => {navigation.navigate("InBMC", {BMC : BMCDummyData[0]})}}
            >
                <Shadow
                    distance={4}
                    offset={[0, 4]}
                    startColor="rgba(185, 185, 185, 0.2)"
                    style={{
                    width: "100%",
                    }}
                >
                    <View style={styles.BMCContainer}>
                        {/* <BMCNote width={50} height={50} />
                        <Text style={styles.BMCText}>내 BMC가 없어요...</Text> */}
                        <Image style={{
                            backgroundColor : Colors.white1,
                            resizeMode : "contain",
                            width : "100%",
                            borderRadius : 8

                            }} source={BMCDummyData[0].thumbnail}
                               resizeMode={"cover"}
                        />
                    </View>
                </Shadow>
            </TouchableOpacity>
            </View>
            <View style={{ height: 16 }} />
            <View style={[commonContainer.container, styles.flatListContainer]}>
            <Text style={styles.listText}>추천 공고</Text>
            <FlatList
                contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 16 }}
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
            <View style={[commonContainer.container, styles.flatListContainer]}>
            <Text style={styles.listText}>멤버 모집</Text>
            <FlatList
                contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 16 }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ overflow: "visible" }}
                data={recruitsItems}
                renderItem={({ item }) => (
                <RecruitsItem
                    id={item.id}
                    title={item.title}
                    companyName={item.companyName}
                    endDate={item.endDate}
                    viewCount={item.viewCount}
                    isClosed={item.isClosed}
                    createdAt={item.createdAt}
                    isHome={true}
                    onPress={(id) => {
                    navigation.navigate("InMatch", { matchId: id });
                    }}
                />
                )}
            />
            </View>
        </ScrollView>
    );
}

const commonContainer = StyleSheet.create({
    container: {
        overflow: "visible",
        paddingHorizontal: 16,
    },
    });

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
    listText: {
        fontSize: 18,
        marginStart: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.black2,
    },
});
