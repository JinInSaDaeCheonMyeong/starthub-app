import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../../constants/Color"
import { Fonts } from "../../constants/Fonts"
import { useCallback, memo } from "react"
import BookMarkFill from "../../assets/icons/bookMark/bookmark.fill.svg"
import BookMark from "../../assets/icons/bookMark/bookmark.svg"
import {NoticeType} from "../../type/notice/notice.type";
import GlassView from "../GlassView"
import { NoticeImages } from "../../constants/AppImages"
import { Image } from 'expo-image';
import { useNoticeStore } from "../../store/noticeStore"
import { ShowToast, ToastType } from "../../util/ShowToast"


interface NoticeItemProps {
    item : NoticeType
    onPress : () => void
}

const categoryMap = {
    "사업화" : {label : "사업화", icon : NoticeImages.business},
    "멘토링ㆍ컨설팅ㆍ교육" : {label : "교육", icon : NoticeImages.education},
    "창업교육" : {label : "교육", icon : NoticeImages.education},
    "행사ㆍ네트워크" : {label : "행사", icon : NoticeImages.event},
    "시설ㆍ공간ㆍ보육" : {label : "시설", icon : NoticeImages.facility},
    "정책자금" : {label : "자금", icon : NoticeImages.funding},
    "글로벌" : {label : "글로벌", icon : NoticeImages.funding},
    "기술개발(R&D)" : {label : "R&D", icon : NoticeImages.rnd},
    "인력" : {label : "인력", icon : NoticeImages.talent},
    "판로ㆍ해외진출" : {label : "글로벌", icon : NoticeImages.global},
    "융자" : {label : "자금", icon : NoticeImages.funding},
} as const

function NoticeItem({
                                       item,
                                       onPress,
                                   } : NoticeItemProps ){
    const isSelected = useNoticeStore((state) => state.likedById[item.id] ?? item.isLiked)
    const isBookmarkLoading = useNoticeStore((state) => state.bookmarkLoadingById[item.id] ?? false)
    const toggleNoticeLike = useNoticeStore((state) => state.toggleNoticeLike)

    const transformDate = useCallback((date : Date) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    }, [])

    const isValidDate = useCallback((date: Date) => {
        return !Number.isNaN(date.getTime())
    }, [])

    const handleBookmarkToggle = useCallback(async () => {
        if (isBookmarkLoading) return
        try {
            await toggleNoticeLike(item.id, item.isLiked)
        } catch (error) {
            ShowToast('오류 발생', '북마크 처리 중 오류가 발생했습니다', ToastType.ERROR)
        }
    }, [isBookmarkLoading, item.id, item.isLiked, toggleNoticeLike])

    const category = categoryMap[item.supportField as keyof typeof categoryMap];
    const hasValidDateRange = isValidDate(item.startDate) && isValidDate(item.endDate)

    return (
        <TouchableOpacity
            onPress={() => {onPress()}}
            key={item.id}
        >
            <GlassView
                containerStyle={styles.shadowContainer}
            >
                <Image style={{width : 50, height : 50}} source={category?.icon}/>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.title}
                    </Text>
                    <Text style={styles.dateText}>
                        {hasValidDateRange
                            ? `모집 : ${transformDate(item.startDate)}~${transformDate(item.endDate)}`
                            : `모집 : ${item.receptionPeriod || '모집기간 정보 없음'}`}
                    </Text>
                    <View style={styles.bookMarkCotainer}>
                        <View style={[styles.hashTagContainer, {height : 'auto'}]}>
                            {[item.region].map((value, index) => (
                                <Text key={index} style={styles.hashTagText}>{`#${value}`}</Text>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={handleBookmarkToggle}
                            disabled={isBookmarkLoading}
                            activeOpacity={0.7}
                        >
                            {isSelected ? (
                                <BookMarkFill
                                    width={24}
                                    height={24}
                                    color={'rgba(36, 102, 244, 0.7)'}
                                />
                            ) : (
                                <BookMark
                                    width={24}
                                    height={24}
                                    color={'rgba(36, 102, 244, 0.7)'}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </GlassView>
        </TouchableOpacity>
    )
}

export default memo(NoticeItem);

const styles = StyleSheet.create({
    shadowContainer: {
        paddingHorizontal : 10,
        paddingVertical : 20,
        alignItems : 'center',
        flexDirection : 'row',
        gap : 17
    },
    titleContainer: {
        gap: 4,
        flex : 1,
        flexShrink : 1
    },
    titleText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: Colors.black2,
    },
    dateText: {
        fontSize: 13,
        fontFamily: Fonts.reqular,
        color: Colors.gray2
    },
    hashTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flexGrow : 1,
        gap: 8,
        overflow : "hidden"
    },
    hashTagText: {
        fontSize: 13,
        fontFamily: Fonts.medium,
        color: Colors.primary
    },
    bookMarkCotainer : {
        flexDirection : "row",
        gap : 32,
        justifyContent : "space-between",
        alignItems : "center",
        width : "100%"
    }
})
