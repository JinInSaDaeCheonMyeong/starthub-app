import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccToken, getRefToken, removeTokens, saveAccToken, saveRefToken } from "../util/token";
import { BackHandler, Platform } from "react-native";
import { RefreshResponse } from "../type/user/refresh.type";
import { ShowToast, ToastType } from "../util/ShowToast";
import popToSigninScreen from "../util/NavigationService";


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry ?: boolean
}

const StartHubAxios = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 65000,
});

// 요청
StartHubAxios.interceptors.request.use(
    async (config) => {
        const token = await getAccToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답
StartHubAxios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
            error.response?.status === 401 && 
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refresh = await getRefToken();
                if (!refresh) throw new Error("리프레시 토큰이 없습니다");

                const response : RefreshResponse = (await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}user/reissue`,
                    { refresh },
                    {headers: {'X-Platform': 'app'}}
                )).data

                if (!response.data.access) throw new Error("토큰을 받아오지 못하였습니다");

                await saveAccToken(response.data.access);
                await saveRefToken(response.data.refresh);

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return StartHubAxios(originalRequest);
            } catch (error) {
                await removeTokens();
                popToSigninScreen()
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default StartHubAxios;