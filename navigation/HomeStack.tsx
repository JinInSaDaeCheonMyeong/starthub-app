import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home/HomeScreen";
import { BottomBar } from "../component/nav/BottomBar";
import NoticeScreen from "../screens/Home/NoticeScreen";
import BMCScreen from "../screens/Home/BMCScreen";
import {
    Easing,
    ImageBackground,
    Keyboard,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import HeaderBar from "../component/HeaderBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarScreen from "../screens/Home/Calendar/CalendarScreen";
import { Drawer } from "react-native-drawer-layout";
import { useEffect, useState, useCallback } from "react";
import SideBar from "../component/home/SideBar";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";
import { getFCMToken, removeTokens } from "../util/token";
import { resetScheduleList } from "../util/Schedule";
import { ShowToast, ToastType } from "../util/ShowToast";
import { deleteUser, getMe } from "../api/user";
import { isAxiosError } from "axios";
import { GetMeResponse, ProfileProvider } from "../type/user/user.type";
import InputModal from "../component/home/InputModal";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "./RootStack";
import StartupStatus from "../constants/StartupStatus";
import {useFocusEffect} from '@react-navigation/native'
import { removeFCMToken } from "../api/notification";
import { DefaultImage } from "../constants/AppImages";

export type HomeStackParamList = {
    Home : undefined,
    Notice : undefined,
    Calendar : undefined,
    BMC : undefined
}

type HomeStackProps = StackScreenProps<RootStackParamList, 'HomeStack'>;

const Tab = createBottomTabNavigator<HomeStackParamList>();
const backgroundImage = DefaultImage.background

export function HomeStack({ navigation } : HomeStackProps) {
    const insets = useSafeAreaInsets();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [purpose, setPurpose] = useState<"Delete" | "SignOut">("SignOut");
    const [profileData, setProfileData] = useState<GetMeResponse['data'] | undefined>()
    const [profileProvider, setProfileProvider] =
        useState<ProfileProvider>("LOCAL");
    const isLocal = profileProvider === "LOCAL";
    const {width} = useWindowDimensions()

    const fetchData = async () => {
        try {
            const data = (await getMe()).data;
            setProfileData(data)
            setProfileProvider(data.provider);
        } catch (error) {
            ShowToast('', '알 수 없는 오류가 발생했습니다', ToastType.ERROR)
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

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

    const handleOpenModal = (type: "Delete" | "SignOut") => {
        setPurpose(type);
        setModalTitle(
            type === "Delete"
                ? "회원 탈퇴를 하시겠습니까?"
                : "로그아웃을 하시겠습니까?"
            );
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setPassword("");
    };

    const handleSignOut = async () => {
        try {
            await removeTokens();
            await resetScheduleList();
            const fcmToken : string | null = await getFCMToken()
            await (await removeFCMToken(fcmToken ?? '')).data
            setDrawerOpen(false);
            ShowToast("로그아웃", "로그아웃에 성공했습니다", ToastType.SUCCESS)
            navigation.reset({
                index: 0,
                routes: [
                {
                    name: "AuthStack" as any,
                    state: {
                        routes: [{ name: "Welcome" }],
                        index: 0,
                    },
                },
                ]
            })
        } catch (error) {
            ShowToast("로그아웃", "로그아웃에 실패했습니다", ToastType.ERROR);
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteUser = async () => {
        const deleteUserData = isLocal ? { password } : { password: undefined };
        if (!deleteUserData.password && isLocal) {
            ShowToast("회원 탈퇴", "비밀번호를 확인해주세요!", ToastType.ERROR);
            return;
        }
        try {
            (await deleteUser(deleteUserData)).data;
            await removeTokens();
            await resetScheduleList();
            const fcmToken : string | null = await getFCMToken()
            await (await removeFCMToken(fcmToken ?? '')).data
            setDrawerOpen(false);
            ShowToast("회원 탈퇴", "회원 탈퇴에 성공했습니다", ToastType.SUCCESS);
            navigation.reset({
                index: 0,
                routes: [
                {
                    name: "AuthStack" as any,
                    state: {
                        routes: [{ name: "Welcome" }],
                        index: 0,
                    },
                },
                ]
            })
        } catch (error) {
            ShowToast("회원 탈퇴", "회원 탈퇴에 실패했습니다", ToastType.ERROR);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <ImageBackground
        source={backgroundImage}
        style={[styles.container, { paddingTop: insets.top }]}
        >
        <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
            renderDrawerContent={() => {
                const startupStatus = profileData?.startupStatus === StartupStatus.EARLY_STAGE ? StartupStatus.EARLY_STAGE : StartupStatus.PRE_STARTUP
                return (
                <SideBar
                    username={profileData?.username ?? '찾을 수 없는 유저'}
                    startupStatus={startupStatus}
                    navigation={navigation}
                    onXmarkPress={() => setDrawerOpen(false)}
                    handleDeleteUser={() => {
                        handleOpenModal('Delete')
                    }}
                    handleSignOut={() => {
                        handleOpenModal("SignOut");
                    }}
                />
            )
            }}
            drawerPosition="right"
            drawerType="front"
            drawerStyle={{
                width : 303,
            backgroundColor: "white",
            }}
            overlayStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            swipeEnabled
            swipeEdgeWidth={50}
        >
            <Tab.Navigator
            tabBar={(props) => <BottomBar {...props} />}
            screenOptions={{
                header: () => <HeaderBar onClickMenu={() => setDrawerOpen(true)} />,
                animation: "shift",
                transitionSpec: {
                    animation: "timing",
                    config: { duration: 90, easing: Easing.inOut(Easing.ease) },
                },
                sceneStyle: { backgroundColor: "transparent", overflow: "visible" },
            }}
            >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Notice" component={NoticeScreen}/>
            <Tab.Screen name="Calendar" component={CalendarScreen}/>
            <Tab.Screen name="BMC" component={BMCScreen}/>
            </Tab.Navigator>
        </Drawer>
        <InputModal
            isLocal = {isLocal}
            isModalVisible={isModalVisible}
            isKeyboardVisible={isKeyboardVisible}
            setIsKeyboardVisible={setIsKeyboardVisible}
            setIsModalVisible={setIsModalVisible}
            password={password}
            setPassword={setPassword}
            modalTitle={modalTitle}
            purpose={purpose}
            handleCloseModal={handleCloseModal}
            handleDeleteUser={handleDeleteUser}
            handleSignOut={handleSignOut}
        />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingTop: 24,
        gap: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        textAlign: "center",
        color: Colors.error,
    },
    modalInput: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: Colors.black2,
        textAlign: "center",
        marginHorizontal: 16,
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
        paddingVertical: 16,
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