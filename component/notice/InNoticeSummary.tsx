import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassView from "../GlassView";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { NoticeType } from "../../type/notice/notice.type";
import CalendarIcon from "../../assets/icons/notice/calendar.svg";
import OriginalIcon from "../../assets/icons/notice/rectangle.svg";
import BookMarkFill from "../../assets/icons/bookMark/bookmark.fill.svg";
import BookMark from "../../assets/icons/bookMark/bookmark.svg";

type InNoticeSummaryProps = {
    notice: NoticeType;
    periodLabel: string;
    targetAge: string;
    startupHistory: string;
    isSelected: boolean;
    isBookmarkLoading: boolean;
    isSchedules: boolean;
    isScheduleLoading: boolean;
    onOpenURL: (url: string) => void;
    onSaveSchedule: () => void;
    onBookmarkToggle: () => void;
};

export default function InNoticeSummary({
    notice,
    periodLabel,
    targetAge,
    startupHistory,
    isSelected,
    isBookmarkLoading,
    isSchedules,
    isScheduleLoading,
    onOpenURL,
    onSaveSchedule,
    onBookmarkToggle,
}: InNoticeSummaryProps) {
    return (
        <View style={styles.topWrapper}>
            <Text style={styles.titleText}>
                {notice.title}
            </Text>
            <Text style={styles.topDateText}>
                {periodLabel}
            </Text>
            <View style={styles.hashTagContainer}>
                {[notice.region, targetAge, startupHistory].map((item, index) => (
                    <View key={index}>
                        <Text style={styles.hashTagText}>#{item}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.buttons}>
                <View style={styles.featureButtons}>
                    <TouchableOpacity onPress={() => onOpenURL(notice.url)}>
                        <GlassView containerStyle={styles.buttonsContainer} blurPercent={0.45}>
                            <OriginalIcon height={20} color={Colors.primary} />
                            <Text style={styles.buttonText}>원문 보기</Text>
                        </GlassView>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={isScheduleLoading}
                        onPress={onSaveSchedule}
                    >
                        <GlassView containerStyle={styles.buttonsContainer}>
                            <CalendarIcon height={20} />
                            <Text style={styles.buttonText}>
                                {`일정 ${isScheduleLoading ? "로딩 중" : isSchedules ? "삭제" : "추가"}`}
                            </Text>
                        </GlassView>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={onBookmarkToggle}
                    disabled={isBookmarkLoading}
                    activeOpacity={0.7}
                >
                    {isSelected ? (
                        <BookMarkFill
                            width={28}
                            height={28}
                            fill={Colors.primary}
                            color={Colors.primary}
                        />
                    ) : (
                        <BookMark
                            width={28}
                            height={28}
                            color={Colors.primary}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topDateText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.gray1,
    },
    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        paddingTop: 8,
        color: Colors.black1,
    },
    hashTagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 8,
    },
    hashTagText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.primary,
        marginBottom: 4,
    },
    buttons: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    featureButtons: {
        flexDirection: "row",
        gap: 12,
    },
    buttonsContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 14,
        backgroundColor: "rgba(255, 255, 255, 0.45)",
        borderColor: "rgba(255, 255, 255, 0.17)",
        borderWidth: 2,
        gap: 10,
        borderRadius: 8,
    },
    buttonText: {
        fontFamily: Fonts.reqular,
        fontSize: 14,
    },
    topWrapper: {
        gap: 12,
    },
});
