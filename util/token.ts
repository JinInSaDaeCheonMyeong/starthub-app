import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthStorage = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  FCM_TOKEN: "FCMToken",
} as const;

export async function saveAccToken(accessToken: string): Promise<void> {
  await AsyncStorage.setItem(AuthStorage.ACCESS_TOKEN, accessToken);
}

export async function getAccToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AuthStorage.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

export async function saveRefToken(refreshToken: string): Promise<void> {
  await AsyncStorage.setItem(AuthStorage.REFRESH_TOKEN, refreshToken);
}

export async function getRefToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AuthStorage.REFRESH_TOKEN);
  } catch {
    return null;
  }
}

export async function removeTokens(): Promise<void> {
  await AsyncStorage.multiRemove([
    AuthStorage.ACCESS_TOKEN,
    AuthStorage.REFRESH_TOKEN,
  ]);
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
  await AsyncStorage.setItem(AuthStorage.FCM_TOKEN, token);
}

export async function getFCMToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AuthStorage.FCM_TOKEN);
  } catch {
    return null;
  }
}