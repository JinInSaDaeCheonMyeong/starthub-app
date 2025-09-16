import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { Colors } from "../../constants/Color"
import { Fonts } from "../../constants/Fonts"
import BusinessIcon from "../../assets/icons/category/notice/business.svg"
import EducationIcon from "../../assets/icons/category/notice/education.svg"
import EventIcon from "../../assets/icons/category/notice/event.svg"
import FacilityIcon from "../../assets/icons/category/notice/facility.svg"
import FundingIcon from "../../assets/icons/category/notice/funding.svg"
import GlobalIcon from "../../assets/icons/category/notice/global.svg"
import RNDIcon from "../../assets/icons/category/notice/rnd.svg"
import TalentIcon from "../../assets/icons/category/notice/talent.svg"
import { useState } from "react"
import BookMarkFill from "../../assets/icons/bookMark/bookmark.fill.svg"
import BookMark from "../../assets/icons/bookMark/bookmark.svg"

interface NoticeItemProps {
    id: number
    supportField: string
    title: string
    startDate: Date
    endDate: Date
    region: string
    startupHistory: string
    isHome : boolean,
    onPress : () => void
    targetAge: string
}

export default function NoticeItem({
    id, 
    supportField,
    title,
    startDate,
    endDate,
    region,
    isHome,
    onPress,
    targetAge,
} : NoticeItemProps ){
    const {width} = useWindowDimensions()
    const [isSelected, setIsSelected] = useState(false)
    const transformDate = (date : Date) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    }
    const getApplyTargetDisplay = () => {
        if (!targetAge) return "";

        const targets = targetAge
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
        "사업화" : {label : "사업화", icon : <BusinessIcon width={16} height={16} color={Colors.primary}/>},
        "멘토링ㆍ컨설팅ㆍ교육" : {label : "교육", icon : <EducationIcon width={16} height={16} color={Colors.primary}/>},
        "창업교육" : {label : "교육", icon : <EducationIcon width={16} height={16} color={Colors.primary}/>},
        "행사ㆍ네트워크" : {label : "행사", icon : <EventIcon width={16} height={16} color={Colors.primary}/>},
        "시설ㆍ공간ㆍ보육" : {label : "시설", icon : <FacilityIcon width={16} height={16} color={Colors.primary}/>},
        "정책자금" : {label : "자금", icon : <FundingIcon width={16} height={16} color={Colors.primary}/>},
        "글로벌" : {label : "글로벌", icon : <GlobalIcon width={16} height={16} color={Colors.primary}/>},
        "기술개발(R&D)" : {label : "R&D", icon : <RNDIcon width={16} height={16} color={Colors.primary}/>},
        "인력" : {label : "인력", icon : <TalentIcon width={16} height={16} color={Colors.primary}/>}
    }
    return (
        <TouchableOpacity 
        onPress={() => {onPress()}}
        key={id}
        style={{
            width : isHome ? width/2 : "100%"
            }}
        >
            <View
                style={[styles.shadowContainer,{borderColor:Colors.white2, borderWidth:2, borderRadius: 16}]}
            >
                <View style={styles.mainContainer}>
                    <View style={styles.categoryContainer}>
                        {categoryMap[supportField as keyof typeof categoryMap]?.icon}
                        <Text style={styles.categoryText}>
                            {categoryMap[supportField as keyof typeof categoryMap]?.label}
                        </Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.titleText, isHome && {
                            lineHeight : 20,
                            height : 44
                        }]} 
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </Text>
                        <Text style={styles.dateText}>
                            {`모집 : ${transformDate(startDate)}~${transformDate(endDate)}`}
                        </Text>
                    </View>
                    <View style={styles.bookMarkCotainer}>
                        <View style={[styles.hashTagContainer, {height : isHome ? 34 : 'auto'}]}>
                            {[region, applyTargetDisplay].map((value, index) => (
                                <Text key={index} style={styles.hashTagText}>{`#${value}`}</Text>
                            ))}
                        </View>
                        {!isHome && (
                                <TouchableOpacity onPress={() => {setIsSelected((value) => !value)}}>
                                    {isSelected ? 
                                    <BookMarkFill 
                                        width={24}
                                        height={24}
                                        fill={Colors.primary}
                                        color={Colors.primary}
                                    />
                                    :
                                    <BookMark
                                        width={24}
                                        height={24}
                                        color={Colors.black2}
                                    />
                                    }
                                </TouchableOpacity>
                            )
                        }   
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        borderRadius: 16,
        overflow: 'visible',
        width: '100%',
    },
    mainContainer: {
        backgroundColor: Colors.white1,
        padding: 20,
        borderRadius: 16,
        gap: 12,
        width: '100%',
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center'
    },
    categoryText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: Colors.primary
    },
    titleContainer: {
        gap: 4,
    },
    titleText: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.black2,
    },
    dateText: {
        fontSize: 12,
        fontFamily: Fonts.medium,
        color: Colors.black2
    },
    hashTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flexGrow : 1,
        gap: 8,
        overflow : "hidden"
    },
    hashTagText: {
        fontSize: 12,
        lineHeight : 12,
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