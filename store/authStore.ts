import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const AuthStorage = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  FCM_TOKEN: "FCMToken",
} as const;

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  fcmToken: string | null;
  initialized: boolean;
  loadTokens: () => Promise<void>;
  setAccessToken: (token: string) => Promise<void>;
  setRefreshToken: (token: string) => Promise<void>;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => Promise<void>;
  setFCMToken: (token: string) => Promise<void>;
  clearTokens: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  fcmToken: null,
  initialized: false,

  loadTokens: async () => {
    const [[, accessToken], [, refreshToken], [, fcmToken]] =
      await AsyncStorage.multiGet([
        AuthStorage.ACCESS_TOKEN,
        AuthStorage.REFRESH_TOKEN,
        AuthStorage.FCM_TOKEN,
      ]);

    set({
      accessToken,
      refreshToken,
      fcmToken,
      initialized: true,
    });
  },

  setAccessToken: async (token) => {
    await AsyncStorage.setItem(AuthStorage.ACCESS_TOKEN, token);
    set({ accessToken: token });
  },

  setRefreshToken: async (token) => {
    await AsyncStorage.setItem(AuthStorage.REFRESH_TOKEN, token);
    set({ refreshToken: token });
  },

  setTokens: async ({ accessToken, refreshToken }) => {
    await AsyncStorage.multiSet([
      [AuthStorage.ACCESS_TOKEN, accessToken],
      [AuthStorage.REFRESH_TOKEN, refreshToken],
    ]);
    set({ accessToken, refreshToken });
  },

  setFCMToken: async (token) => {
    await AsyncStorage.setItem(AuthStorage.FCM_TOKEN, token);
    set({ fcmToken: token });
  },

  clearTokens: async () => {
    await AsyncStorage.multiRemove([
      AuthStorage.ACCESS_TOKEN,
      AuthStorage.REFRESH_TOKEN,
    ]);
    set({ accessToken: null, refreshToken: null });
  },
}));
