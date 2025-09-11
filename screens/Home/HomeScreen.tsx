import { FlatList, ScrollView,  StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import NoticeItem from "../../component/notice/NoticeItem";
import { NoticeItemList } from "../../constants/NoticeItemList";
import { CompositeScreenProps } from "@react-navigation/core";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../../navigation/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import Carousel from "react-native-reanimated-carousel";
import useHomeScreen from "../../hooks/home/useHomeScreen";
import Banner from "../../component/home/Banner";

export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Home">,
    StackScreenProps<RootStackParamList>
>;

export default function HomeScreen(props : HomeScreenProps) {
    const {
        form : {
            noticeItems,
            carouselData,
            carouselMaxIndex
        },
        ui : {
            width,
            carouselHeight,
        },
        actions : {
            goWeb
        }
    } = useHomeScreen(props)

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.flatListContainer}>
                <View style={styles.bannerContainer}>
                    <Carousel
                        loop
                        width={width}
                        height={carouselHeight}
                        autoPlay
                        data={carouselData}
                        autoPlayInterval={5000}
                        scrollAnimationDuration={1300}
                        renderItem={({index, item : props}) => (
                            <Banner
                                {...props}
                                index={index + 1}
                                maxIndex={carouselMaxIndex}
                                height={carouselHeight}
                            />
                        )}
                    />
                </View>
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>지원 사업 공고</Text>
                        <Text style={styles.captionText}>카테고리를 눌러 공고를 조회할 수 있어요</Text>
                    </View>
                    <View>
                        <View>
                            <View>
                                
                            </View>
                            <Text>
                                사업화
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
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
                <View style={styles.flatListWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>내 일정 공고</Text>
                        <Text style={styles.captionText}>사용자님의 일정 중 마감 기한이 임박한 순으로 제공해 드려요</Text>
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
    flatListContainer: {
        gap: 32,
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    bannerContainer : {
        gap : 20
    },
    flatListWrapper : {
        gap : 12
    },
    textWrapper : {
        gap : 6
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
