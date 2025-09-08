import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Linking } from "react-native";
import BackButton from "../../component/BackButton";
import RightArrow from "../../assets/icons/right-arrow-back.svg"
import BookmarkIcon from '../../assets/icons/bookMark/bookmark.svg'
import TimeIcon from '../../assets/icons/section/time.svg'
import WriteIcon from '../../assets/icons/section/writing.svg'
import InfoIcon from '../../assets/icons/section/information.svg'
import ServiceIcon from '../../assets/icons/section/service.svg'
import PersonIcon from "../../assets/icons/section/person.svg";
import { Colors } from "../../constants/Color";
import { StackScreenProps } from "@react-navigation/stack";
import { Fonts } from "../../constants/Fonts";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { removeTokens } from "../../util/token";
import { JSX } from "react";

type SystemScreenProps = StackScreenProps<SystemStackParamList, 'System'>

type navSectionType = {
    title: string
    sections: {
        label: string
        icon: JSX.Element
        stackName: keyof SystemStackParamList
    }[]
};

export default function SystemScreen({navigation} : SystemScreenProps) {

    const onPress = () => {
        ShowToast("개발", "아직 개발 중인 기능입니다", ToastType.INFO)
    }

    const navSections : navSectionType[] = [
        {
            title : '프로필',
            sections : [
                {
                    label : '내 프로필 보기', 
                    icon : <PersonIcon width={20} height={20} color={Colors.black2}/>,
                    stackName : 'Profile'
                }
            ]
        },
        {
            title : '나의 활동',
            sections : [
                {
                    label : '최근 본 게시물', 
                    icon : <TimeIcon width={20} height={20} color={Colors.black2}/>,
                    stackName : 'Profile'
                },
                {
                    label : '내 북마크', 
                    icon : <BookmarkIcon width={20} height={20} color={Colors.black2}/>,
                    stackName : 'Profile'
                },
                {
                    label : '내 작성글', 
                    icon : <WriteIcon width={20} height={20} color={Colors.black2}/>,
                    stackName : 'Profile'
                }
            ]
        },
    ]
    const linkSection = {
        title : '고객 센터',
        sections : [
            {
                label : '이용 약관', 
                icon : <InfoIcon width={20} height={20} color={Colors.black2}/>,
                link : 'https://www.dominilbo.com/news/articleView.html?idxno=216474'
            },
            {
                label : '고객 센터', 
                icon : <ServiceIcon width={20} height={20} color={Colors.black2}/>,
                link : 'https://www.dominilbo.com/news/articleView.html?idxno=216474'
            },
        ]
    }

    return (
        <View style={styles.safeArea}>
            <View style={styles.header}>
                <BackButton
                    width={24}
                    height={24}
                    color={Colors.black2}
                    onClick={() => {navigation.goBack()}}
                />
                <Text style={styles.headerTitle}>설정</Text>
                <View style={styles.headerRight}/>
            </View>
            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false} 
                style={styles.scroll} 
                contentContainerStyle={styles.scrollContent}
            >
                {navSections.map((value, index) => ( 
                    <View key={index} style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>{value.title}</Text>
                        <View style={styles.sectionRowWrap}>
                            {value.sections.map(({label, icon, stackName}, idx) => (
                                <TouchableOpacity 
                                    onPress={() => {
                                        switch(stackName){
                                            case "Profile":
                                                navigation.navigate(stackName)
                                                break
                                            default:
                                                onPress()
                                        }
                                    }} 
                                    key={idx} 
                                    style={styles.sectionRow}
                                >
                                    <View style={styles.sectionRowLeft}>
                                        {icon}
                                        <Text style={styles.sectionRowText}>{label}</Text>
                                    </View>
                                    <RightArrow width={16} height={16} color={Colors.black2}/>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{linkSection.title}</Text>
                    <View style={styles.sectionRowWrap}>
                        {linkSection.sections.map(({label, icon, link}, idx) => (
                            <TouchableOpacity 
                                onPress={() => Linking.openURL(link)} 
                                key={idx} 
                                style={styles.sectionRow}
                            >
                                <View style={styles.sectionRowLeft}>
                                    {icon}
                                    <Text style={styles.sectionRowText}>{label}</Text>
                                </View>
                                <RightArrow width={16} height={16} color={Colors.black2}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <TouchableOpacity 
                    hitSlop={16}
                    style={{
                        alignItems : "flex-end", 
                        marginRight : 12
                    }} 
                    onPress={ async() => {
                        try {
                            await removeTokens()
                            ShowToast("로그아웃", "로그아웃에 성공하셨습니다", ToastType.SUCCESS)
                            navigation.popToTop()
                            
                        } catch (error) {
                            ShowToast("로그아웃", "로그아웃에 실패하셨습니다", ToastType.ERROR)
                        }
                    }}
                >
                    <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerTitle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 18,
        color: Colors.gray1,
    },
    headerRight: {
        width: 24,
        height: 24,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    profileShadow: {
        width : "100%",
        borderRadius: 12,
        marginBottom: 8,
    },
    profileCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    profileCardInner: {
        width : "100%",
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white1,
        borderWidth : 2,
        borderColor : Colors.white2,
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.gray2,
    },
    profileInfo: {
        flex: 1,
    },
    profileCompany: {
        fontFamily: Fonts.medium,
        fontSize: 12,
        color: Colors.black2,
    },
    profileName: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        color: Colors.black2,
    },
    menuRowWrap: {
        width : "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap : 16
    },
    menuShadow: {
        flex: 1,
    },
    menuButton: {
        flex : 1,
    },
    menuButtonInner: {
        backgroundColor: Colors.white1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical : 16,
        borderWidth : 2,
        borderColor : Colors.white2,
    },
    menuButtonText: {
        fontFamily: Fonts.semiBold,
        fontSize: 14,
        color: Colors.black2,
        textAlign: 'center',
    },
    sectionWrap: {
        gap: 16,
    },
    sectionRowWrap : {
        gap : 12
    },
    sectionShadow: {
        width : "100%",
        borderRadius: 12,
    },
    sectionCard: {
        width : "100%",
        backgroundColor: Colors.white1,
        borderWidth : 2,
        borderColor : Colors.white2,
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.black2,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionRowText: {
        fontFamily: Fonts.semiBold,
        fontSize: 14,
        color: Colors.black2,
    },
    logoutText : {
        fontSize : 12,
        color : Colors.error,
        fontFamily : Fonts.bold
    }
});