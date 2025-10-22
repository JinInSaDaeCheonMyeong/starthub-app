import React, { useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { formatToDate } from "../../../util/DateFormat";
import LeftIcon from "../../../assets/icons/left-arrow-back.svg";
import RightIcon from "../../../assets/icons/right-arrow-back.svg";
import * as Progress from "react-native-progress";
import useCalendarScreen from "../../../hooks/home/useCalendarScreen";
import { ShowToast, ToastType } from "../../../util/ShowToast";
import { CompositeScreenProps } from "@react-navigation/core";
import { HomeStackParamList } from "../../../navigation/HomeStack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import GlassView from "../../../component/GlassView";
import { NoticeType } from "../../../type/notice/notice.type";
import NoticeItem from "../../../component/notice/NoticeItem";
import XIcon from "../../../assets/icons/xmark.svg";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

export type CalendarScreenProps = CompositeScreenProps<
  BottomTabScreenProps<HomeStackParamList, "Calendar">,
  StackScreenProps<RootStackParamList>
>;

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const {
    form: {
      loading,
      noticeItemList,
      currentDate,
      setLoading,
      setViewingMonth,
      setCurrentDate,
      viewingMonth,
    },
    ui: { markedDates, width, todayString },
    action: { getNoticeItem },
  } = useCalendarScreen();

  const renderItem = useCallback(
    ({ item }: { item: NoticeType }) => (
      <NoticeItem
        item={item}
        onPress={() => navigation.navigate("InNotice", { Notice: item })}
      />
    ),
    [navigation]
  );

  /** 캘린더 헤더를 FlatList의 Header로 이동 */
  const renderCalendarHeader = useCallback(() => (
    <GlassView containerStyle={{ padding: 20, marginTop: 16 }}>
      <Calendar
        style={styles.calendar}
        theme={{
          weekVerticalMargin: 0,
          calendarBackground: "transparent",
          backgroundColor: "transparent",
        }}
        markingType="multi-dot"
        markedDates={markedDates}
        customHeader={(props: any) => {
          const currentMonth = formatToDate(props.month, "calendar");
          return (
            <View style={styles.headerContainer}>
              <View style={styles.headerTop}>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    props.addMonth(-1);
                    const prevMonth = new Date(
                      props.month.getFullYear(),
                      props.month.getMonth() - 1,
                      1
                    );
                    setViewingMonth(
                      formatToDate(prevMonth, "solid").substring(0, 7)
                    );
                  }}
                >
                  <LeftIcon width={16} height={16} color={Colors.black2} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{currentMonth}</Text>

                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    props.addMonth(1);
                    const nextMonth = new Date(
                      props.month.getFullYear(),
                      props.month.getMonth() + 1,
                      1
                    );
                    setViewingMonth(
                      formatToDate(nextMonth, "solid").substring(0, 7)
                    );
                  }}
                >
                  <RightIcon width={16} height={16} color={Colors.black2} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        dayComponent={({ date, state, marking, onPress }) => {
          const isSelect = date?.dateString === currentDate;
          const isDisable = state === "disabled";
          const isToday = date?.dateString === todayString;
          const dateMonth = date?.dateString?.substring(0, 7);
          const shouldHideToday = isToday && dateMonth !== viewingMonth;

          if (isDisable || !(!shouldHideToday)) return null;

          return (
            <TouchableOpacity
              key={date?.dateString ?? "undefined"}
              style={[
                styles.dayContainer,
                {
                  width: (width - 26 * 7) / 7,
                  height: (width - 26 * 7) / 7,
                  backgroundColor: isSelect ? Colors.second : "transparent",
                  borderColor: isSelect
                    ? "rgba(255,255,255,0.48)"
                    : "transparent",
                },
              ]}
              onPress={async () => {
                try {
                  onPress?.(date);
                  setCurrentDate(date?.dateString ?? currentDate);
                  setLoading(true);
                  await getNoticeItem(date?.dateString ?? currentDate);
                  setLoading(false);
                } catch {
                  ShowToast(
                    "오류 발생",
                    "일정을 불러 올 수 없습니다",
                    ToastType.ERROR
                  );
                }
              }}
            >
              <View style={{ position: "absolute" }}>
                <Text
                  style={[
                    styles.dayText,
                    isSelect
                      ? { color: Colors.white1 }
                      : !isDisable
                      ? { color: Colors.black2 }
                      : { color: Colors.gray3 },
                  ]}
                >
                  {date?.day}
                </Text>
                {!isSelect && (
                  <View style={styles.dotsContainer}>
                    {marking?.dots?.slice(0, 3).map((dot, index) => (
                      <View
                        key={index}
                        style={[styles.dot, { backgroundColor: dot.color }]}
                      />
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </GlassView>
  ), [markedDates, viewingMonth, currentDate]);

  return (
    <FlatList
      data={loading ? [] : noticeItemList}
      keyExtractor={(item: NoticeType) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      ListHeaderComponent={renderCalendarHeader}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 40,
        gap: 12,
      }}
      ListEmptyComponent={
        loading ? (
          <View style={styles.loadingBox}>
            <Progress.Circle
              indeterminate
              color={Colors.second}
              size={50}
              thickness={300}
              borderWidth={1}
            />
          </View>
        ) : (
          <View style={styles.errorMsgBox}>
            <XIcon color={Colors.error} width={32} height={32} />
            <Text style={styles.errorText}>해당 날짜에 일정이 없습니다</Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  calendar: {
    gap: 9,
  },
  headerContainer: {
    gap: 8,
  },
  headerTop: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 30,
    margin: 9,
    gap: 1,
  },
  dayText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  errorMsgBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 48,
    gap: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
  },
});
