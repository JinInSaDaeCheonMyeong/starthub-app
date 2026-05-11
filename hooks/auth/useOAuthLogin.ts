import { useCallback, useState } from "react";
import { Linking, Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { NavigationProp } from "@react-navigation/native";
import {
    appleOAuthApp,
    getOAuthState,
    googleOAuthApp,
} from "../../api/oauth";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { ShowToast, ToastType } from "../../util/ShowToast";
import useAuthLoginSuccess from "./useAuthLoginSuccess";

WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = "google" | "apple";

const googleDiscovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
};

const GOOGLE_STATE_TIMEOUT_MS = 1200;
const GOOGLE_ANDROID_REDIRECT_PATH = "oauthredirect";
const GOOGLE_ANDROID_REVERSE_SCHEME_PREFIX = "com.googleusercontent.apps.";
const GOOGLE_CLIENT_ID_SUFFIX = ".apps.googleusercontent.com";

const normalizeGoogleAndroidClientId = (value?: string) => {
    const trimmedValue = value?.trim();

    if (!trimmedValue) return undefined;

    if (trimmedValue.startsWith(GOOGLE_ANDROID_REVERSE_SCHEME_PREFIX)) {
        const clientIdBody = trimmedValue
            .slice(GOOGLE_ANDROID_REVERSE_SCHEME_PREFIX.length)
            .split(":/")[0];

        return clientIdBody
            ? `${clientIdBody}${GOOGLE_CLIENT_ID_SUFFIX}`
            : undefined;
    }

    return trimmedValue;
};

const getGoogleAndroidRedirectUri = (clientId: string, rawValue?: string) => {
    const trimmedValue = rawValue?.trim();

    if (trimmedValue?.startsWith(GOOGLE_ANDROID_REVERSE_SCHEME_PREFIX)) {
        return trimmedValue;
    }

    const clientIdBody = clientId.endsWith(GOOGLE_CLIENT_ID_SUFFIX)
        ? clientId.slice(0, -GOOGLE_CLIENT_ID_SUFFIX.length)
        : clientId;

    return `${GOOGLE_ANDROID_REVERSE_SCHEME_PREFIX}${clientIdBody}:/${GOOGLE_ANDROID_REDIRECT_PATH}`;
};

const getRedirectUri = (clientId: string, rawAndroidValue?: string) =>
    Platform.OS === "ios"
        ? "com.jininsa.startHubapp://"
        : getGoogleAndroidRedirectUri(clientId, rawAndroidValue);

const getOAuthErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? "소셜 로그인에 실패했습니다";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "소셜 로그인에 실패했습니다";
};

const getOAuthStateWithTimeout = async () => {
    try {
        const result = await Promise.race([
            getOAuthState(),
            new Promise<null>((resolve) => {
                setTimeout(() => resolve(null), GOOGLE_STATE_TIMEOUT_MS);
            }),
        ]);

        return result?.data;
    } catch {
        return undefined;
    }
};

const waitForRedirectUrl = (redirectUri: string, timeoutMs = 120000) =>
    new Promise<string>((resolve, reject) => {
        const subscription = Linking.addEventListener("url", ({ url }) => {
            if (!url.startsWith(redirectUri)) return;

            clearTimeout(timeoutId);
            subscription.remove();
            resolve(url);
        });

        const timeoutId = setTimeout(() => {
            subscription.remove();
            reject(new Error("구글 로그인 응답을 받지 못했습니다"));
        }, timeoutMs);
    });

const promptGoogleAuthAsync = async (
    request: AuthSession.AuthRequest
): Promise<AuthSession.AuthSessionResult> => {
    if (Platform.OS !== "android") {
        return request.promptAsync(googleDiscovery);
    }

    const authUrl = await request.makeAuthUrlAsync(googleDiscovery);
    const redirectPromise = waitForRedirectUrl(request.redirectUri);

    await Linking.openURL(authUrl);

    const redirectedUrl = await redirectPromise;
    return request.parseReturnUrl(redirectedUrl);
};

export default function useOAuthLogin(
    navigation: NavigationProp<AuthStackParamList>
) {
    const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
    const { completeLogin } = useAuthLoginSuccess(navigation);

    const loginWithGoogle = useCallback(async () => {
        const androidGoogleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;
        const clientId = Platform.OS === "android"
            ? normalizeGoogleAndroidClientId(androidGoogleClientId)
            : process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;

        if (!clientId) {
            ShowToast("설정 필요", "구글 클라이언트 ID가 없습니다", ToastType.WARNING);
            return;
        }

        setLoadingProvider("google");

        try {
            const state = await getOAuthStateWithTimeout();
            const redirectUri = getRedirectUri(clientId, androidGoogleClientId);
            const request = new AuthSession.AuthRequest({
                clientId,
                redirectUri,
                responseType: AuthSession.ResponseType.Code,
                scopes: ["openid", "profile", "email"],
                state,
                usePKCE: true,
            });

            const result = await promptGoogleAuthAsync(request);

            if (result.type === "cancel" || result.type === "dismiss") return;
            if (result.type !== "success") {
                ShowToast("실패", "구글 로그인을 완료하지 못했습니다", ToastType.ERROR);
                return;
            }

            const code = result.params.code;
            const codeVerifier = request.codeVerifier;

            if (!code || !codeVerifier) {
                ShowToast("실패", "구글 인증 정보를 확인할 수 없습니다", ToastType.ERROR);
                return;
            }

            const { data } = await googleOAuthApp({
                code,
                state: request.state,
                platform: Platform.OS,
                codeVerifier,
            });

            await completeLogin(data);
        } catch (error) {
            ShowToast("문제가 발생했습니다", getOAuthErrorMessage(error), ToastType.ERROR);
        } finally {
            setLoadingProvider(null);
        }
    }, [completeLogin]);

    const loginWithApple = useCallback(async () => {
        if (Platform.OS !== "ios") {
            ShowToast("지원 불가", "애플 로그인은 iOS에서만 사용할 수 있습니다", ToastType.WARNING);
            return;
        }

        setLoadingProvider("apple");

        try {
            const isAvailable = await AppleAuthentication.isAvailableAsync();

            if (!isAvailable) {
                ShowToast("지원 불가", "이 기기에서 애플 로그인을 사용할 수 없습니다", ToastType.WARNING);
                return;
            }

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (!credential.identityToken) {
                ShowToast("실패", "애플 인증 토큰을 확인할 수 없습니다", ToastType.ERROR);
                return;
            }

            const { data } = await appleOAuthApp({
                idToken: credential.identityToken,
            });

            await completeLogin(data);
        } catch (error: any) {
            if (error?.code === "ERR_REQUEST_CANCELED") return;
            ShowToast("문제가 발생했습니다", getOAuthErrorMessage(error), ToastType.ERROR);
        } finally {
            setLoadingProvider(null);
        }
    }, [completeLogin]);

    return {
        loadingProvider,
        loginWithGoogle,
        loginWithApple,
    };
}
