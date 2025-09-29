import axios from "axios";
import { saveAccToken, saveRefToken } from "../util/token";
import { ShowToast, ToastType } from "../util/ShowToast";
import { Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_API_URL;

export async function getState() {
  try {
    const response = await axios.get(url + "/oauth/state");
    return response.data.data;
  } catch (error: any) {
    ShowToast("문제가 발생하였습니다.", error.message, ToastType.ERROR);
    return;
  }
}

export async function googleLogin(code: string, codeVerifier: string) {
  const state = await getState();
  const platform = Platform.OS;
  if (!state) {
    ShowToast("문제가 발생하였습니다.", "state is undefined", ToastType.ERROR);
    return;
  }
  try {
    console.log(state);
    console.log(platform);
    console.log(code);
    console.log(codeVerifier);
    const response = await axios.get(url + "/oauth/google/app", {
      params: {
        code: code,
        state: state,
        platform: platform,
        codeVerifier: codeVerifier,
      },
    });
    await saveAccToken(response.data.data.access);
    await saveRefToken(response.data.data.refresh);
    return response.data.data.isFirstLogin;
  } catch (error: any) {
    // Surface more details from the backend to help diagnose 4xx/5xx
    const status = error?.response?.status;
    const data = error?.response?.data;
    const serverMsg =
      (typeof data === "string"
        ? data
        : data?.message || data?.error || data?.error_description) ||
      error?.message;
    console.error("[googleLogin] exchange failed", { status, data });
    ShowToast("문제가 발생하였습니다.", serverMsg, ToastType.ERROR);
  }
}
