import * as WebBrowser from "expo-web-browser";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { Platform } from "react-native";
import { googleLogin } from "../api/oauth";
import { ShowToast, ToastType } from "../util/ShowToast";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export default function useGoogleLogin(onSuccess?: (isFirst: boolean) => void) {
  const androidClientIdFull =
      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || "";
  const androidClientIdSub = androidClientIdFull.replace(
      ".apps.googleusercontent.com",
      ""
  );
  const clientId = Platform.select({
    ios: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    android: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID
  })
  const nativeRedirect = Platform.select({
    android: androidClientIdSub
        ? `com.googleusercontent.apps.${androidClientIdSub}:/oauthredirect`
        : "startHub-app://redirect",
  });
  const scheme = Platform.select({
    android: "startHub-app",
    ios : "com.jininsa.startHubapp",
  })

  const redirectUri = makeRedirectUri({
    scheme: scheme,
    native: nativeRedirect,
  });

  const [request, response, promptAsync] = useAuthRequest({
    clientId,
    responseType: ResponseType.Code,
    scopes: ["openid", "profile", "email"],
    usePKCE: true,
    redirectUri,
  },
  discovery
  );

  useEffect(() => {
    const handleResponse = async () => {
      try {
        if (response?.type === "success") {
          const code = (response as any)?.params?.code;
          const codeVerifier = request?.codeVerifier;
          if (code && codeVerifier) {
            console.log("Code Verifier: ",codeVerifier);
            console.log("Code: ",code);
            const isFirst = await googleLogin(code, codeVerifier);
            if (onSuccess && typeof isFirst !== "undefined") {
              onSuccess(isFirst);
            }
          }
        } else if (response?.type === "error") {
          const err = (response as any)?.params?.error || "구글 로그인 오류";
          ShowToast("문제가 발생하였습니다.", err, ToastType.ERROR);
        }
      } catch (e: any) {
        ShowToast(
            "문제가 발생하였습니다.",
            e?.message || String(e),
            ToastType.ERROR
        );
      }
    };
    handleResponse();
  }, [response]);

  return { request, promptAsync };
}