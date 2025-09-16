import { ScrollView, Text, TouchableOpacity, View, StyleSheet, useWindowDimensions } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { formatToDate } from "../../../util/DateFormat";
import LeftIcon from "../../../assets/icons/left-arrow-back.svg";
import RightIcon from "../../../assets/icons/right-arrow-back.svg";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarModal from "../../../component/calendar/CalendarModal";
import { NoticeItemList } from "../../../constants/NoticeItemList";
import { buildDeadlineMarks } from "../../../util/MarkedDates";

LocaleConfig.locales['ko'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

export default function CalendarScreen() {
    const dotInfoList = [
        { color: Colors.info, text: "마감 4주전" },
        { color: Colors.warning, text: "마감 2주전" },
        { color: Colors.error, text: "마감 1주전" },
    ];
    const dayDataList = ['일', '월', '화', '수', '목', '금', '토'];

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const [day, setDay] = useState('')

    const handleModalClose = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleModalOpen = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const getNoticeItem = (ids : number[]) => {

    }
    
    const markedDates = buildDeadlineMarks([
        { id: 1, startTime: "2025-09-14", endTime: "2025-10-15" },
        { id: 2, startTime: "2025-09-15", endTime: "2025-10-16" },
        { id: 3, startTime: "2025-09-16", endTime: "2025-10-17" },
        { id: 4, startTime: "2025-09-01", endTime: "2025-10-01" },
    ]);

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Calendar
                style={styles.calendar}
                theme={{
                    calendarBackground: Colors.white1,
                    weekVerticalMargin: 0,
                }}
                markingType={"multi-dot"}
                markedDates={markedDates}
                customHeader={(props: any) => (
                    <View style={styles.headerContainer}>
                        <View style={styles.headerTop}>
                            <Text style={styles.headerTitle}>
                                {formatToDate(props.month, "calendar")}
                            </Text>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity hitSlop={8} onPress={() => props.addMonth(-1)}>
                                    <LeftIcon width={20} height={20} color={Colors.black2} />
                                </TouchableOpacity>
                                <TouchableOpacity hitSlop={8} onPress={() => props.addMonth(1)}>
                                    <RightIcon width={20} height={20} color={Colors.black2} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.dotLegend}>
                            {dotInfoList.map((value, index) => (
                                <View style={styles.dotLegendItem} key={index}>
                                    <View style={[styles.dotLegendDot, { backgroundColor: value.color }]} />
                                    <Text style={styles.dotLegendText}>{value.text}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.weekDays}>
                            {dayDataList.map((value, index) => (
                                <View key={index} style={styles.weekDayItem}>
                                    <Text
                                        style={[
                                            styles.weekDayText,
                                            index === 0 && { color: Colors.error },
                                            index === 6 && { color: Colors.info },
                                        ]}
                                    >
                                        {value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                dayComponent={({date, state, marking, onPress}) => {
                    const dotIds = marking?.dots?.map((dot : any) => dot.id) ?? [];

                    return (
                        <TouchableOpacity
                            style={[
                                styles.dayContainer,
                                { backgroundColor: state !== 'disabled' ? Colors.white1 : Colors.white2 },
                            ]}
                            onPress={() => {
                                console.log('Dot IDs:', dotIds);
                                onPress?.(date);
                                setDay(`${date ? `${date.month}월 ${date.day}일 공고 일정` : "날짜를 찾을 수 없습니다"}`);
                                handleModalOpen();
                            }}
                        >
                            <View
                                style={[
                                    styles.dayCircle,
                                    { backgroundColor: state === 'today' ? Colors.primary : undefined },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        state === 'today'
                                            ? { color: Colors.white1 }
                                            : state !== 'disabled'
                                            ? { color: Colors.black2 }
                                            : { color: Colors.gray3 },
                                    ]}
                                >
                                    {date?.day}
                                </Text>
                            </View>
                            {marking?.dots && (
                                <View style={styles.dotsContainer}>
                                    {marking.dots.map((dot, index) => (
                                        <View
                                            key={index}
                                            style={[styles.dot, { backgroundColor: dot.color }]}
                                        />
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    )
                }}
            />
            <CalendarModal
                scheduleList={[...NoticeItemList,]}
                day={day}
                bottomSheetModalRef={bottomSheetModalRef}
                handleModalClose={() => {handleModalClose()}}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    calendar: {
        gap: 8,
        marginBottom: 24,
    },
    headerContainer: {
        gap: 8,
    },
    headerTop: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerTitle: {
        fontFamily: Fonts.semiBold,
        fontSize: 20,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    dotLegend: {
        flexDirection: 'row',
        gap: 8,
    },
    dotLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 4,
    },
    dotLegendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dotLegendText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.black2,
    },
    weekDays: {
        flexDirection: 'row',
        paddingVertical: 6,
        marginTop: 16,
    },
    weekDayItem: {
        flex: 1,
    },
    weekDayText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        textAlign: 'center',
        color: Colors.black2,
    },
    dayContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 90,
    },
    dayCircle: {
        padding: 6,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
