import { useState, useCallback } from "react";
import { getMe, deleteUser } from "../../api/user";
import { GetMeResponse, ProfileProvider } from "../../type/user/user.type";
import { getFCMToken, removeTokens } from "../../util/token";
import { resetScheduleList } from "../../util/Schedule";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { removeFCMToken } from "../../api/notification";

export default function useSideBar(navigation: any) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileData, setProfileData] = useState<GetMeResponse['data'] | undefined>();
    const [profileProvider, setProfileProvider] = useState<ProfileProvider>("LOCAL");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [purpose, setPurpose] = useState<"Delete" | "SignOut">("SignOut");
    const isLocal = profileProvider === "LOCAL";

    const fetchProfile = useCallback(async () => {
        try {
            const data = (await getMe()).data;
            setProfileData(data);
            setProfileProvider(data.provider);
        } catch {
            ShowToast('', '알 수 없는 오류가 발생했습니다', ToastType.ERROR);
        }
    }, []);

    const handleOpenModal = useCallback((type: "Delete" | "SignOut") => {
        setPurpose(type);
        setModalTitle(
            type === "Delete"
                ? "회원 탈퇴를 하시겠습니까?"
                : "로그아웃을 하시겠습니까?"
        );
        setIsModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setPassword("");
    }, []);

    const cleanupAndNavigateToAuth = useCallback(async () => {
        await removeTokens();
        await resetScheduleList();
        const fcmToken = await getFCMToken();
        if (fcmToken) await removeFCMToken(fcmToken);
        setDrawerOpen(false);
        navigation.reset({
            index: 0,
            routes: [{ name: "AuthStack" }],
        });
    }, [navigation]);

    const handleSignOut = useCallback(async () => {
        try {
            await cleanupAndNavigateToAuth();
            ShowToast("로그아웃", "로그아웃에 성공했습니다", ToastType.SUCCESS);
        } catch {
            ShowToast("로그아웃", "로그아웃에 실패했습니다", ToastType.ERROR);
        } finally {
            handleCloseModal();
        }
    }, [cleanupAndNavigateToAuth, handleCloseModal]);

    const handleDeleteUser = useCallback(async () => {
        const deleteUserData = isLocal ? { password } : { password: undefined };
        if (!deleteUserData.password && isLocal) {
            ShowToast("회원 탈퇴", "비밀번호를 확인해주세요!", ToastType.ERROR);
            return;
        }
        try {
            await deleteUser(deleteUserData);
            await cleanupAndNavigateToAuth();
            ShowToast("회원 탈퇴", "회원 탈퇴에 성공했습니다", ToastType.SUCCESS);
        } catch {
            ShowToast("회원 탈퇴", "회원 탈퇴에 실패했습니다", ToastType.ERROR);
        } finally {
            handleCloseModal();
        }
    }, [isLocal, password, cleanupAndNavigateToAuth, handleCloseModal]);

    return {
        drawerOpen,
        setDrawerOpen,
        profileData,
        isLocal,
        isModalVisible,
        setIsModalVisible,
        isKeyboardVisible,
        setIsKeyboardVisible,
        password,
        setPassword,
        modalTitle,
        purpose,
        fetchProfile,
        handleOpenModal,
        handleCloseModal,
        handleSignOut,
        handleDeleteUser,
    };
}
