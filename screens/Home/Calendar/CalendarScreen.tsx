import { ScrollView, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/core";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ScheduleCalendar from "../../../component/calendar/ScheduleCalendar";
import ScheduleNoticeList from "../../../component/calendar/ScheduleNoticeList";
import useCalendarScreen from "../../../hooks/home/useCalendarScreen";
import { HomeStackParamList } from "../../../navigation/HomeStack";
import { RootStackParamList } from "../../../navigation/RootStack";

export type CalendarScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, "Calendar">,
    NativeStackScreenProps<RootStackParamList>
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
        ui: {
            markedDates,
            width,
            todayString,
        },
        action: {
            getNoticeItem,
        },
    } = useCalendarScreen();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ScheduleCalendar
                markedDates={markedDates}
                width={width}
                currentDate={currentDate}
                todayString={todayString}
                viewingMonth={viewingMonth}
                setCurrentDate={setCurrentDate}
                setViewingMonth={setViewingMonth}
                setLoading={setLoading}
                getNoticeItem={getNoticeItem}
            />
            <ScheduleNoticeList
                loading={loading}
                noticeItemList={noticeItemList}
                onNoticePress={(item) => navigation.navigate("InNotice", { Notice: item })}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        position: "relative",
    },
});
