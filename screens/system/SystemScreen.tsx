import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Linking, Modal, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
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
import { JSX, useCallback, useEffect, useState } from "react";
import { resetScheduleList } from "../../util/Schedule";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { deleteUser, getMe } from "../../api/user";
import { isAxiosError } from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileProvider } from "../../type/user/user.type";
import { useFocusEffect } from "@react-navigation/native"

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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [purpose, setPurpose] = useState<'Delete' | 'SignOut'>('SignOut')
    const [modalTitle, setModalTitle] = useState('')
    const [password, setPassword] = useState('')
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [profileProvider, setProfileProvieder] = useState<ProfileProvider>('LOCAL')
    const isLocal = profileProvider === 'LOCAL';

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () =>
            setIsKeyboardVisible(true)
        );
        const hideSub = Keyboard.addListener("keyboardDidHide", () =>
            setIsKeyboardVisible(false)
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = (await getMe()).data.provider
                    setProfileProvieder(data)
                } catch (error) {
                    ShowToast("회원 탈퇴", "사용자 정보를 불러오는데 실패했습니다", ToastType.ERROR);
                    navigation.goBack()
                }
            }
            fetchData()
        }, [])
    )

    const insets = useSafeAreaInsets()

    const handleOpenModal = async (purpose : 'Delete' | 'SignOut') => {
        setPurpose(purpose)
        switch(purpose){
            case "Delete":
                setModalTitle("회원 탈퇴를 하시겠습니까?");
                setIsModalVisible(true);
                return
            case "SignOut":
                setModalTitle("로그아웃을 하시겠습니까?");
                setIsModalVisible(true);
                return
            default:
                return
        }
    }

    const handleCloseModal = () => {
        setIsModalVisible(false)
        setPassword("")
    }

    const handleSignOut = async () => {
        try {
            await removeTokens();
            await resetScheduleList();
            ShowToast("로그아웃", "로그아웃에 성공하셨습니다", ToastType.SUCCESS);
            navigation.popToTop();
        } catch (error) {
            ShowToast("로그아웃", "로그아웃에 실패하셨습니다", ToastType.ERROR);
        } finally {
            handleCloseModal()
        }
    };

    const handleDeleteUser = async () => {
        const deleteUserData = isLocal ? {password} : {password : undefined}
        if(!deleteUserData.password && isLocal){
            ShowToast("회원 탈퇴", "비밀번호를 확인해주세요!", ToastType.ERROR);
            handleCloseModal();
            return
        }
        try {
            (await deleteUser(deleteUserData)).data
            await removeTokens();
            await resetScheduleList();
            handleCloseModal();
            ShowToast("회원 탈퇴", "회원 탈퇴에 성공하셨습니다", ToastType.SUCCESS);
            navigation.popToTop();
        } catch (error) {
            ShowToast("회원 탈퇴", "회원 탈퇴에 실패하셨습니다", ToastType.ERROR);
            if(isAxiosError(error)){
                console.log(error.response?.data)
            }
            handleCloseModal();
        }
    }

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
                    stackName : 'MyLikes'
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
            <SubHeaderBar
                title="설정"
                handleBackPress={navigation.goBack}
            />
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
                                            case "MyLikes":
                                                navigation.navigate(stackName)
                                                break
                                            default:
                                                onPress()
                                        }
                                    }} 
                                    hitSlop={{top : 6, bottom : 6, right : 16, left : 16}}
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
                                hitSlop={{top : 6, bottom : 6, right : 16, left : 16}}
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
                <View style={{
                    flexDirection : 'row-reverse',
                    alignItems : "flex-end", 
                    gap : 20,
                    paddingHorizontal : 16
                }}>
                    <TouchableOpacity 
                        onPress={() => {handleOpenModal('SignOut')}}
                        hitSlop={{top : 16, bottom : 16, left : 10, right : 16}}
                    >
                        <Text style={styles.logoutText}>로그아웃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {handleOpenModal("Delete")}}
                        hitSlop={{top : 16, bottom : 16, left : 16, right : 10}}
                    >
                        <Text style={styles.logoutText}>회원 탈퇴</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                transparent
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => {
                    setIsModalVisible(false)
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (isKeyboardVisible) {
                            Keyboard.dismiss(); 
                        } else {
                            setIsModalVisible(false);
                        }
                    }}
                >
                <KeyboardAvoidingView 
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={-insets.top}
                >
                    <View style={styles.modalContent}>
                        <View style={{
                            gap : 8
                        }}>
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                            {
                                purpose === 'Delete' && isLocal && (
                                    <TextInput
                                        style={{
                                            fontSize : 16,
                                            fontFamily : Fonts.medium,
                                            color : Colors.black2,
                                            textAlign : 'center',
                                            marginHorizontal : 16,
                                        }}
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                        value={password}
                                        onChangeText={(v) => setPassword(v)}
                                        placeholder="비밀번호를 입력해주세요"
                                        placeholderTextColor={Colors.gray3}
                                        numberOfLines={1}
                                    />
                                )
                            }
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => 
                                    handleCloseModal()
                                }
                            >
                                <Text style={styles.cancelButton}>아니오</Text>
                            </TouchableOpacity>
                            <View style={styles.modalDivider} />
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={async () => {
                                    switch(purpose){
                                        case "Delete":
                                            await handleDeleteUser()
                                            return
                                        case "SignOut":
                                            await handleSignOut();
                                            return
                                    }
                                }}
                            >
                                <Text style={styles.confirmButton}>예</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
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
        fontSize : 14,
        color : Colors.error,
        fontFamily : Fonts.semiBold
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: Colors.white1,
        borderRadius: 12,
        width: "80%",
        overflow: "hidden", 
        paddingTop : 24,
        gap : 20
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        textAlign: "center",
        color: Colors.error,
    },
    modalSubText : {
        fontSize: 14,
        fontFamily: Fonts.medium,
        textAlign: "center",
        color: Colors.gray2,
    },
    modalButtons: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: Colors.gray3,
    },
    modalButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical : 16
    },
    modalDivider: {
        width: 1,
        backgroundColor: Colors.gray3,
    },
    cancelButton: {
        fontSize: 14,
        color: Colors.gray2,
        fontFamily: Fonts.semiBold,
    },
    confirmButton: {
        fontSize: 14,
        color: Colors.info,
        fontFamily: Fonts.semiBold,
    },
});