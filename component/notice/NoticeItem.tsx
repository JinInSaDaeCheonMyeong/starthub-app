import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { NoticeItemType } from "../../type/notice/notice.type"
import { Shadow } from "react-native-shadow-2"
import { Colors } from "../../constants/Color"
import { Fonts } from "../../constants/Fonts"
import { NoticeCategory } from "../../constants/NoticeCategory"
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

interface NoticeItemProps extends NoticeItemType {
    isHome : boolean,
    onPress : () => void
}

export default function NoticeItem({
    id, 
    category,
    title,
    startTime,
    endTime,
    location,
    years,
    isHome,
    onPress,
} : NoticeItemProps ){
    const {width} = useWindowDimensions()
    const [isSelected, setIsSelected] = useState(false)
    const transformDate = (date : Date) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    }
    const categoryMap = {
        [NoticeCategory.BUSINESS] : {label : "사업화", icon : <BusinessIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.EDUCATION] : {label : "교육", icon : <EducationIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.EVENT] : {label : "행사", icon : <EventIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.FACILITY] : {label : "시설", icon : <FacilityIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.FUNDING] : {label : "자금", icon : <FundingIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.GLOBAL] : {label : "글로벌", icon : <GlobalIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.RND] : {label : "R&D", icon : <RNDIcon width={16} height={16} color={Colors.primary}/>},
        [NoticeCategory.TALENT] : {label : "인력", icon : <TalentIcon width={16} height={16} color={Colors.primary}/>}
    }
    return (
        <TouchableOpacity 
        onPress={() => {onPress()}}
        key={id}
        style={{
            width : isHome ? width/2 : "100%"
            }}
        >
            <Shadow
                containerStyle={styles.shadowContainer}
                distance={4} 
                offset={[0, 4]}
                startColor="rgba(185, 185, 185, 0.2)"
                style={{
                    width : isHome ? width/2 : "100%"
                }}
            >
                <View style={styles.mainContainer}>
                    <View style={styles.categoryContainer}>
                        {categoryMap[category]?.icon}
                        <Text style={styles.categoryText}>
                            {categoryMap[category]?.label}
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
                            {`모집 : ${transformDate(startTime)}~${transformDate(endTime)}`}
                        </Text>
                    </View>
                    <View style={styles.bookMarkCotainer}>
                        <View style={[styles.hashTagContainer, {height : isHome ? 34 : 'auto'}]}>
                            {[location, ...years].map((value, index) => (
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
            </Shadow>
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