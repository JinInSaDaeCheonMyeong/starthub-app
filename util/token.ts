import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthStorage, useAuthStore } from "../store/authStore";

export { AuthStorage };

export async function saveAccToken(accessToken: string): Promise<void> {
  await useAuthStore.getState().setAccessToken(accessToken);
}

export async function getAccToken(): Promise<string | null> {
  try {
    const cached = useAuthStore.getState().accessToken;
    if (cached) return cached;

    const accessToken = await AsyncStorage.getItem(AuthStorage.ACCESS_TOKEN);
    if (accessToken) {
      useAuthStore.setState({ accessToken });
    }
    return accessToken;
  } catch {
    return null;
  }
}

export async function saveRefToken(refreshToken: string): Promise<void> {
  await useAuthStore.getState().setRefreshToken(refreshToken);
}

export async function getRefToken(): Promise<string | null> {
  try {
    const cached = useAuthStore.getState().refreshToken;
    if (cached) return cached;

    const refreshToken = await AsyncStorage.getItem(AuthStorage.REFRESH_TOKEN);
    if (refreshToken) {
      useAuthStore.setState({ refreshToken });
    }
    return refreshToken;
  } catch {
    return null;
  }
}

export async function removeTokens(): Promise<void> {
  await useAuthStore.getState().clearTokens();
}

export async function hasValidTokens(): Promise<boolean> {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      getAccToken(),
      getRefToken(),
    ]);
    return !!(accessToken && refreshToken);
  } catch {
    return false;
  }
}

export async function saveFCMToken(token: string): Promise<void> {
  await useAuthStore.getState().setFCMToken(token);
}

export async function getFCMToken(): Promise<string | null> {
  try {
    const cached = useAuthStore.getState().fcmToken;
    if (cached) return cached;

    const fcmToken = await AsyncStorage.getItem(AuthStorage.FCM_TOKEN);
    if (fcmToken) {
      useAuthStore.setState({ fcmToken });
    }
    return fcmToken;
  } catch {
    return null;
  }
}
