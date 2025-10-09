import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { Colors } from "../../constants/Color"
import { Fonts } from "../../constants/Fonts"
import BusinessIcon from "../../assets/icons/glass/notice/buisness.svg";
import EducationIcon from "../../assets/icons/glass/notice/education.svg";
import EventIcon from "../../assets/icons/glass/notice/event.svg";
import FacilityIcon from "../../assets/icons/glass/notice/facility.svg";
import FundingIcon from "../../assets/icons/glass/notice/funding.svg";
import GlobalIcon from "../../assets/icons/glass/notice/global.svg";
import RNDIcon from "../../assets/icons/glass/notice/rnd.svg";
import TalentIcon from "../../assets/icons/glass/notice/buisness.svg"
import { useState, useEffect } from "react"
import BookMarkFill from "../../assets/icons/bookMark/bookmark.fill.svg"
import BookMark from "../../assets/icons/bookMark/bookmark.svg"
import {NoticeType} from "../../type/notice/notice.type";
import {deleteLikes, postLikes} from "../../api/likes";
import GlassView from "../GlassView"

interface NoticeItemProps {
    item : NoticeType
    onPress : () => void
}
export default function NoticeItem({
                                       item,
                                       onPress,
                                   } : NoticeItemProps ){
    const [isSelected, setIsSelected] = useState(item.isLiked)
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

    // item.isLiked가 변경될 때마다 내부 상태도 동기화
    useEffect(() => {
        setIsSelected(item.isLiked);
    }, [item.isLiked]);

    const transformDate = (date : Date) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    }
    console.log(item.id)

    const getApplyTargetDisplay = () => {
        if (!item.targetAge) return "";

        const targets = item.targetAge
            .split(",")
            .map((target) => target.trim())
            .filter((target) => target);
        if (targets.length === 0) return "";

        const firstTarget = targets[0];

        const getAgeGroup = (target: string) => {
            const match = target.match(/만\s*(\d+)\s*세/);
            if (!match) return target;
            const age = parseInt(match[1], 10);

            if (target.includes("~")) {
                if (age >= 20 && age < 30) return "20대";
                if (age >= 30 && age < 40) return "30대";
                if (age >= 40 && age < 50) return "40대";
                if (age >= 50 && age < 60) return "50대";
                return `${age}대`;
            } else {
                if (target.includes("이상")) {
                    return `${age}세 이상`;
                }
                if (target.includes("이하")) {
                    return `${age}세 이하`;
                }
                return `${age}세`;
            }
        };

        const display = getAgeGroup(firstTarget);
        return targets.length > 1 ? `${display} 등` : display;
    };

    const applyTargetDisplay = getApplyTargetDisplay();

    const categoryMap = {
        "사업화" : {label : "사업화", icon : <BusinessIcon width={50} height={50} color={Colors.primary}/>},
        "멘토링ㆍ컨설팅ㆍ교육" : {label : "교육", icon : <EducationIcon width={50} height={50} color={Colors.primary}/>},
        "창업교육" : {label : "교육", icon : <EducationIcon width={50} height={50} color={Colors.primary}/>},
        "행사ㆍ네트워크" : {label : "행사", icon : <EventIcon width={50} height={50} color={Colors.primary}/>},
        "시설ㆍ공간ㆍ보육" : {label : "시설", icon : <FacilityIcon width={50} height={50} color={Colors.primary}/>},
        "정책자금" : {label : "자금", icon : <FundingIcon width={50} height={50} color={Colors.primary}/>},
        "글로벌" : {label : "글로벌", icon : <GlobalIcon width={50} height={50} color={Colors.primary}/>},
        "기술개발(R&D)" : {label : "R&D", icon : <RNDIcon width={50} height={50} color={Colors.primary}/>},
        "인력" : {label : "인력", icon : <TalentIcon width={50} height={50} color={Colors.primary}/>},
        "판로ㆍ해외진출" : {label : "글로벌", icon : <GlobalIcon width={50} height={50} color={Colors.primary}/>},
    }

    const handleBookmarkToggle = async () => {
        if (isBookmarkLoading) return

        setIsBookmarkLoading(true)
        try {
            if (isSelected) {
                await deleteLikes(item.id)
            } else {
                await postLikes(item.id)
            }
            item.isLiked = !item.isLiked
            setIsSelected((prev) => !prev)
        } catch (error) {
            console.error('북마크 토글 중 오류:', error)
        } finally {
            setIsBookmarkLoading(false)
        }
    }

    return (
        <TouchableOpacity
            onPress={() => {onPress()}}
            key={item.id}
        >
            <GlassView
                containerStyle={styles.shadowContainer}
            >
                {categoryMap[item.supportField as keyof typeof categoryMap]?.icon}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.title}
                    </Text>
                    <Text style={styles.dateText}>
                        {`모집 : ${transformDate(item.startDate)}~${transformDate(item.endDate)}`}
                    </Text>
                    <View style={styles.bookMarkCotainer}>
                        <View style={[styles.hashTagContainer, {height : 'auto'}]}>
                            {[item.region, applyTargetDisplay].map((value, index) => (
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