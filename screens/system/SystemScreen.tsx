import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import BackButton from "../../component/BackButton";
import RightArrow from "../../assets/icons/right-arrow-back.svg"
import AnalysisIcon from '../../assets/icons/analysis.svg';
import ScaleIcon from '../../assets/icons/scale.svg';
import CrownIcon from '../../assets/icons/crown.svg';
import BookmarkIcon from '../../assets/icons/bookMark/bookmark.svg'
import TimeIcon from '../../assets/icons/section/time.svg'
import WriteIcon from '../../assets/icons/section/writing.svg'
import CompanyIcon from '../../assets/icons/section/company.svg'
import InfoIcon from '../../assets/icons/section/information.svg'
import ServiceIcon from '../../assets/icons/section/service.svg'
import { Colors } from "../../constants/Color";
import { StackScreenProps } from "@react-navigation/stack";
import { Shadow } from "react-native-shadow-2";
import { Fonts } from "../../constants/Fonts";
import { useCallback, useEffect, useState } from "react";
import { ShowToast, ToastType } from "../../util/ShowToast";
import {  isAxiosError } from "axios";
import { getMe } from "../../api/user";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { GetMeResponse } from "../../type/user/user.type";
import {useFocusEffect} from "@react-navigation/native"
import { removeTokens } from "../../util/token";

type SystemScreenProps = StackScreenProps<SystemStackParamList, 'System'>

export default function SystemScreen({navigation} : SystemScreenProps) {
    const DEFAULT_DATA = ''
    const [companyName, setCompanyName] = useState('소속된 기업이 없습니다...')
    const [user, setUser] = useState<GetMeResponse['data']>({
        id : -1, 
        email : DEFAULT_DATA,
        username : DEFAULT_DATA,
        birth : DEFAULT_DATA,
        gender : DEFAULT_DATA,
        profileImage : DEFAULT_DATA,
        introduction : DEFAULT_DATA
    })

    const onPress = () => {
        ShowToast("개발", "아직 개발 중인 기능입니다", ToastType.INFO)
    }

    const menus = [
        {label : '경쟁사\n분석', icon : <AnalysisIcon width={40} height={40} color={Colors.primary} />},
        {label : '지원금\n비교', icon : <ScaleIcon width={40} height={40} color={Colors.primary} />},
        {label : '프리미엄\n결제', icon : <CrownIcon width={40} height={40} color={Colors.primary} />}
    ];
    const sections = [
        {
            title : '나의 활동',
            sections : [
                {label : '최근 본 게시물', icon : <TimeIcon width={20} height={20} color={Colors.black2}/>},
                {label : '내 북마크', icon : <BookmarkIcon width={20} height={20} color={Colors.black2}/>},
                {label : '내 작성글', icon : <WriteIcon width={20} height={20} color={Colors.black2}/>}
            ]
        },
        {
            title : '나의 기업',
            sections : [
                {label : '내 소속', icon : <CompanyIcon width={20} height={20} color={Colors.black2}/>},
            ]
        },
        {
            title : '고객 센터',
            sections : [
                {label : '이용 약관', icon : <InfoIcon width={20} height={20} color={Colors.black2}/>},
                {label : '고객 센터', icon : <ServiceIcon width={20} height={20} color={Colors.black2}/>},
            ]
        }
    ]

    useFocusEffect(
        useCallback(() => {
            const fetchUserProfile = async () => {
                try {
                    const userInfo = (await getMe()).data
                    setUser(userInfo)
                } catch (error) {
                    if(isAxiosError(error)){
                        ShowToast("오류 발생", error.message, ToastType.ERROR)
                    }
                }
            }

            fetchUserProfile()
        }, [])
    )

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
                <TouchableOpacity onPress={() => navigation.navigate("Profile", {...user})}>
                    <Shadow 
                        distance={4} 
                        offset={[0, 4]}
                        startColor="rgba(185, 185, 185, 0.2)"
                        style={styles.profileShadow}
                    >
                        <View style={styles.profileCardInner}>
                            <Image source={{uri: user.profileImage}} style={styles.profileImage}/>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileCompany}>{companyName}</Text>
                                    <Text style={styles.profileName}>{user.username}</Text>
                                </View>
                            <RightArrow width={16} height={16} color={Colors.black2}/>
                        </View>
                    </Shadow>
                </TouchableOpacity>
                <View style={styles.menuRowWrap}>
                    {menus.map(({label, icon}, index) => (
                        <TouchableOpacity  
                            onPress={() => onPress()}
                            key={index} 
                            style={styles.menuButton}
                        >
                            <Shadow
                                distance={4} 
                                offset={[0, 4]} 
                                startColor="rgba(185, 185, 185, 0.2)" 
                                style={styles.sectionShadow}
                            >
                                <View style={styles.menuButtonInner}>
                                    {icon}
                                    <Text style={styles.menuButtonText}>{label}</Text>
                                </View>
                            </Shadow>
                        </TouchableOpacity>
                    ))}
                </View>
                {sections.map((value, index) => ( 
                    <Shadow 
                        key={index}
                        distance={4} 
                        offset={[0, 4]} 
                        startColor="rgba(185, 185, 185, 0.2)" 
                        style={styles.sectionShadow}
                    >
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>{value.title}</Text>
                            <View style={styles.sectionRowWrap}>
                                {value.sections.map(({label, icon}, idx) => (
                                    <TouchableOpacity onPress={() => onPress()} key={idx} style={styles.sectionRow}>
                                        <View style={styles.sectionRowLeft}>
                                            {icon}
                                            <Text style={styles.sectionRowText}>{label}</Text>
                                        </View>
                                        <RightArrow width={16} height={16} color={Colors.black2}/>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Shadow>
                ))}
                <TouchableOpacity 
                    style={{alignItems : "flex-end", margin : 12}} 
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
        paddingVertical : 16
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