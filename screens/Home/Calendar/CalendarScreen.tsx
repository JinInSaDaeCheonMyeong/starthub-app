import { ScrollView, Text, TouchableOpacity, View, StyleSheet,useWindowDimensions, FlatList } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
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
import { useMemo, useState } from "react";
import GlassView from "../../../component/GlassView";
import { NoticeType } from "../../../type/notice/notice.type";
import NoticeItem from "../../../component/notice/NoticeItem";
import XIcon from "../../../assets/icons/xmark.svg";

LocaleConfig.locales['ko'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

export type CalendarScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Calendar">,
    StackScreenProps<RootStackParamList>
>

export default function CalendarScreen({navigation} : CalendarScreenProps) {
    const {
        form : {
            loading,
            noticeItemList,
            setLoading,
            setNoticeItemList
        },
        ui : {
            markedDates,
        },
    } = useCalendarScreen()
    const {width} = useWindowDimensions()
    const today = new Date()
    const todayString = formatToDate(today, 'solid');
    const [currentDate, setCurrentDate] = useState(todayString)
    const [viewingMonth, setViewingMonth] = useState(todayString.substring(0, 7))
    return (
        <>
        <View style={styles.container}>
            <GlassView
                containerStyle={{padding : 20}}
            >
                <Calendar
                    style={styles.calendar}
                    theme={{
                        weekVerticalMargin : 0,
                        calendarBackground: 'transparent',
                        backgroundColor: 'transparent',
                    }}
                    onMonthChange={(date) => {
                        setViewingMonth(date.dateString.substring(0, 7))
                    }}
                    markingType={"multi-dot"}
                    markedDates={markedDates}
                    customHeader={(props: any) => {
                        const currentMonth = formatToDate(props.month, 'calendar')
                    
                        return (
                            <View style={styles.headerContainer}>
                                <View style={styles.headerTop}>
                                    <TouchableOpacity
                                        hitSlop={8}
                                        onPress={() => {
                                        props.addMonth(-1);
                                        const prevMonth = new Date(props.month.getFullYear(), props.month.getMonth() - 1, 1);
                                        setViewingMonth(formatToDate(prevMonth, 'solid').substring(0, 7));
                                        }}
                                    >
                                        <LeftIcon width={16} height={16} color={Colors.black2} />
                                    </TouchableOpacity>
                            
                                    <Text style={styles.headerTitle}>
                                        {currentMonth}
                                    </Text>
                        
                                    <View style={styles.headerButtons}>
                                        <TouchableOpacity
                                        hitSlop={8}
                                        onPress={() => {
                                            props.addMonth(1);
                                            const nextMonth = new Date(props.month.getFullYear(), props.month.getMonth() + 1, 1);
                                            setViewingMonth(formatToDate(nextMonth, 'solid').substring(0, 7));
                                        }}
                                        >
                                        <RightIcon width={16} height={16} color={Colors.black2} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    dayComponent={({date, state, marking, onPress}) => {
                        const dotIds = marking?.dots?.map((dot : any) => dot.id) ?? [];
                        const isSelect = date?.dateString === currentDate;
                        const isDisable = state === 'disabled'
                        const isToday = date?.dateString === todayString 
                        const dateMonth = date?.dateString?.substring(0, 7)
                        
                        const shouldHideToday = isToday && dateMonth !== viewingMonth

                        return isDisable || !shouldHideToday && (
                            <TouchableOpacity
                                key={date?.dateString ?? 'undefind'}
                                style={[
                                    styles.dayContainer,
                                    {
                                        width : (width - 36)/7,
                                        backgroundColor : isSelect ? Colors.primary : 'transparent'
                                    }
                                ]}
                                onPress={async () => {
                                    try {
                                        onPress?.(date);
                                        setCurrentDate(date?.dateString ?? currentDate)
                                        setLoading(true);
                                        setLoading(false);
                                    } catch (error) {
                                        ShowToast("오류 발생", "일정 리스트를 불러 올 수 없습니다", ToastType.ERROR)
                                    }
                                }}
                            >
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
                                {marking?.dots && !isSelect && (
                                    <View style={styles.dotsContainer}>
                                        {marking.dots.slice(0,3).map((dot, index) => (
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
            </GlassView>
            <FlatList
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop : 8,
                    gap : 12,
                }}
                style={{
                    flex: 1,  
                }}
                keyExtractor={(item : NoticeType) => item.id.toString()}
                keyboardShouldPersistTaps="handled"
                data={noticeItemList}
                renderItem={({item}) => (
                    <NoticeItem
                        item={item}
                        isHome={false}
                        onPress={() => {navigation.navigate("InNotice", { Notice : item });}}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.errorMsgBox}>
                        <XIcon color={Colors.error} width={32} height={32}/>
                        <Text style={styles.errorText}>
                            {`해당 날짜에 일정이 없습니다`}
                        </Text>
                    </View>
                )}
            />
        </View>
        {loading && (
            <View style={styles.progressContainer}>
                <Progress.Circle
                    color={Colors.second}
                    size={50}
                    indeterminate = {true}
                    thickness = {300}
                    borderWidth={4}
                />
            </View>
        )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        position : 'relative',
        gap : 8
    },
    calendar: {
        gap: 9,
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
        fontSize: 16,
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
    dayContainer: {
        alignItems: 'center',
        paddingVertical : 5,
        borderRadius : 16,
        margin : 9,
        maxWidth : 30,
        gap : 1
    },
    dayCircle: {
        padding : 4,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontFamily: Fonts.semiBold,
        fontSize: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 3,
    },
    progressContainer : {
        position : 'absolute',
        width : '100%',
        height : '100%',
        alignItems : 'center',
        justifyContent : "center",
        backgroundColor : "rgba(0, 0, 0, 0.6)",
    },
    errorMsgBox : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 32,
        marginBottom : 48,
        gap : 24
    },
    errorText : {
        fontSize : 16,
        fontFamily : Fonts.semiBold,
        color : Colors.error
    }
});
