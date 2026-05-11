import { useCallback } from "react";
import { Platform } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { getDeviceTypeAsync, DeviceType as ExpoDeviceType } from "expo-device";
import { getMe } from "../../api/user";
import {
    getMyFCMTokens,
    registerFCMToken,
    removeFCMToken,
} from "../../api/notification";
import { RootStackParamList } from "../../navigation/RootStack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useProfileStore } from "../../store/profileStore";
import { DeviceType } from "../../type/notification/notification.type";
import { OAuthLoginData } from "../../type/oauth/oauth.type";
import { getFCMToken, saveAccToken, saveRefToken } from "../../util/token";

type AuthNavigation = NavigationProp<AuthStackParamList>;

export default function useAuthLoginSuccess(navigation: AuthNavigation) {
    const rootNavigation =
        navigation as unknown as NavigationProp<RootStackParamList>;
    const setProfileData = useProfileStore((state) => state.setProfileData);

    const handleFCMToken = useCallback(async () => {
        const FCMToken = await getFCMToken();

        if (!FCMToken) return;

        const device = await getDeviceTypeAsync();
        let deviceType: DeviceType = "UNKNOWN";

        if (Platform.OS === "ios") {
            deviceType =
                device === ExpoDeviceType.PHONE
                    ? "IOS"
                    : device === ExpoDeviceType.TABLET
                        ? "IPADOS"
                        : "UNKNOWN";
        } else if (Platform.OS === "android") {
            deviceType =
                device === ExpoDeviceType.PHONE
                    ? "ANDROID"
                    : device === ExpoDeviceType.TABLET
                        ? "ANDROID_TABLET"
                        : "UNKNOWN";
        }

        const { data: myFCMTokens } = await getMyFCMTokens();

        for (const value of myFCMTokens) {
            if (
                value.deviceType === deviceType &&
                value.token !== FCMToken
            ) {
                await removeFCMToken(value.token);
            }
        }

        await registerFCMToken({
            token: FCMToken,
            deviceType,
        });
    }, []);

    const completeLogin = useCallback(
        async (data: OAuthLoginData) => {
            await saveAccToken(data.access);
            await saveRefToken(data.refresh);
            await handleFCMToken();

            const { data: userData } = await getMe();
            setProfileData(userData);

            if (!data.isFirstLogin && userData.username) {
                rootNavigation.reset({
                    index: 0,
                    routes: [{ name: "HomeStack" }],
                });
                return;
            }

            navigation.reset({
                index: 0,
                routes: [{ name: "SignupInput" }],
            });
        },
        [handleFCMToken, navigation, rootNavigation, setProfileData]
    );

    return {
        completeLogin,
    };
}
