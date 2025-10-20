import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthStorage = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  FCM_TOKEN: "FCMToken",
} as const;

export async function saveAccToken(accessToken: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AuthStorage.ACCESS_TOKEN, accessToken);
  } catch (error) {
    console.error("액세스 토큰 저장 실패:", error);
    throw error;
  }
}

export async function getAccToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AuthStorage.ACCESS_TOKEN);
  } catch (error) {
    console.error("액세스 토큰 조회 실패:", error);
    return null;
  }
}

export async function saveRefToken(refreshToken: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AuthStorage.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error("리프레시 토큰 저장 실패:", error);
    throw error;
  }
}

export async function getRefToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AuthStorage.REFRESH_TOKEN);
  } catch (error) {
    console.error("리프레시 토큰 조회 실패:", error);
    return null;
  }
}

export async function removeTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      AuthStorage.ACCESS_TOKEN,
      AuthStorage.REFRESH_TOKEN,
    ]);
  } catch (error) {
    console.error("토큰 삭제 실패:", error);
    throw error;
  }
}

export async function hasValidTokens(): Promise<boolean> {
  try {
    const accessToken = await getAccToken();
    const refreshToken = await getRefToken();
    return !!(accessToken && refreshToken);
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return false;
  }
}

export async function saveFCMToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AuthStorage.FCM_TOKEN, token);
  } catch (error) {
    console.error("FCM 토큰 저장 실패:", error);
    throw error;
  }
}

export async function getFCMToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AuthStorage.FCM_TOKEN);
  } catch (error) {
    console.log("FCM 토큰이 없습니다", error);
    return null;
  }
}
