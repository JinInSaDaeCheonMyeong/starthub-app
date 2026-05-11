import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import * as Progress from "react-native-progress";
import NoticeItem from "../notice/NoticeItem";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { NoticeType } from "../../type/notice/notice.type";
import XIcon from "../../assets/icons/xmark.svg";
import ListEmptyState from "../ListEmptyState";

type ScheduleNoticeListProps = {
    loading: boolean;
    noticeItemList: NoticeType[];
    onNoticePress: (notice: NoticeType) => void;
};

const keyExtractor = (item: NoticeType) => item.id.toString();

export default function ScheduleNoticeList({
    loading,
    noticeItemList,
    onNoticePress,
}: ScheduleNoticeListProps) {
    return (
        <FlashList
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            data={loading ? [] : noticeItemList}
            renderItem={({ item }) => (
                <NoticeItem
                    item={item}
                    onPress={() => onNoticePress(item)}
                />
            )}
            ListEmptyComponent={() => (
                loading ? (
                    <View style={styles.loadingContainer}>
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
                        <ListEmptyState
                            message="해당 날짜에 일정 항목이 없습니다."
                            style={styles.scheduleEmptyState}
                            textStyle={styles.errorText}
                        />
                    </View>
                )
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContent: {
        paddingTop: 20,
        paddingBottom: 20,
        gap: 12,
    },
    loadingContainer: {
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
    scheduleEmptyState: {
        minHeight: 0,
    },
    errorText: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.error,
    },
});
