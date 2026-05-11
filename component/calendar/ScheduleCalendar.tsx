import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import GlassView from "../GlassView";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { formatToDate } from "../../util/DateFormat";
import { ShowToast, ToastType } from "../../util/ShowToast";
import LeftIcon from "../../assets/icons/left-arrow-back.svg";
import RightIcon from "../../assets/icons/right-arrow-back.svg";

LocaleConfig.locales.ko = {
    monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
    today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

type ScheduleCalendarProps = {
    markedDates: any;
    width: number;
    currentDate: string;
    todayString: string;
    viewingMonth: string;
    setCurrentDate: (value: string) => void;
    setViewingMonth: (value: string) => void;
    setLoading: (value: boolean) => void;
    getNoticeItem: (date: string) => Promise<unknown>;
};

export default function ScheduleCalendar({
    markedDates,
    width,
    currentDate,
    todayString,
    viewingMonth,
    setCurrentDate,
    setViewingMonth,
    setLoading,
    getNoticeItem,
}: ScheduleCalendarProps) {
    return (
        <GlassView containerStyle={styles.glassContainer}>
            <Calendar
                style={styles.calendar}
                theme={calendarTheme}
                markingType="multi-dot"
                markedDates={markedDates}
                customHeader={(props: any) => (
                    <CalendarHeader
                        month={props.month}
                        addMonth={props.addMonth}
                        setViewingMonth={setViewingMonth}
                    />
                )}
                dayComponent={({ date, state, marking, onPress }) => {
                    const isSelect = date?.dateString === currentDate;
                    const isDisable = state === "disabled";
                    const isToday = date?.dateString === todayString;
                    const dateMonth = date?.dateString?.substring(0, 7);
                    const shouldHideToday = isToday && dateMonth !== viewingMonth;

                    return isDisable || !shouldHideToday && (
                        <TouchableOpacity
                            key={date?.dateString ?? "undefined"}
                            style={[
                                styles.dayContainer,
                                {
                                    width: (width - 26 * 7) / 7,
                                    height: (width - 26 * 7) / 7,
                                    backgroundColor: isSelect ? Colors.second : "transparent",
                                    borderColor: isSelect ? "rgba(255, 255, 255, 0.48)" : "transparent",
                                },
                            ]}
                            onPress={async () => {
                                try {
                                    const nextDate = date?.dateString ?? currentDate;
                                    onPress?.(date);
                                    setCurrentDate(nextDate);
                                    setLoading(true);
                                    await getNoticeItem(nextDate);
                                    setLoading(false);
                                } catch {
                                    ShowToast("오류 발생", "일정 리스트를 불러 올 수 없습니다", ToastType.ERROR);
                                }
                            }}
                        >
                            <View style={styles.absolute}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        isSelect
                                            ? styles.selectedDayText
                                            : !isDisable
                                                ? styles.enabledDayText
                                                : styles.disabledDayText,
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
    );
}

function CalendarHeader({
    month,
    addMonth,
    setViewingMonth,
}: {
    month: Date;
    addMonth: (count: number) => void;
    setViewingMonth: (value: string) => void;
}) {
    const currentMonth = formatToDate(month, "calendar");

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <TouchableOpacity
                    hitSlop={8}
                    onPress={() => {
                        addMonth(-1);
                        const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
                        setViewingMonth(formatToDate(prevMonth, "solid").substring(0, 7));
                    }}
                >
                    <LeftIcon width={16} height={16} color={Colors.black2} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {currentMonth}
                </Text>

                <TouchableOpacity
                    hitSlop={8}
                    onPress={() => {
                        addMonth(1);
                        const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
                        setViewingMonth(formatToDate(nextMonth, "solid").substring(0, 7));
                    }}
                >
                    <RightIcon width={16} height={16} color={Colors.black2} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const calendarTheme = {
    weekVerticalMargin: 0,
    calendarBackground: "transparent",
    backgroundColor: "transparent",
};

const styles = StyleSheet.create({
    glassContainer: {
        padding: 20,
        marginTop: 16,
    },
    calendar: {
        gap: 9,
        paddingLeft: 0,
        paddingRight: 0,
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
    absolute: {
        position: "absolute",
    },
    dayText: {
        fontFamily: Fonts.semiBold,
        fontSize: 16,
    },
    selectedDayText: {
        color: Colors.white1,
    },
    enabledDayText: {
        color: Colors.black2,
    },
    disabledDayText: {
        color: Colors.gray3,
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
});
