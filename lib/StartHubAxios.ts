import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAccToken, getRefToken, removeTokens, saveAccToken, saveRefToken } from "../util/token";
import { RefreshResponse } from "../type/user/refresh.type";
import popToSigninScreen from "../util/NavigationService";
import { API_URL } from "../util/apiUrl";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    _dedup?: boolean;
}

const pendingRequests = new Map<string, Promise<AxiosResponse>>();

const getRequestKey = (config: InternalAxiosRequestConfig): string => {
    const { method, url, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
};

const StartHubAxios = axios.create({
    baseURL: API_URL,
    timeout: 300000,
});

// 요청 인터셉터
StartHubAxios.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
        const token = await getAccToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // _dedup 플래그가 있으면 실제 요청 (중복 요청이 아닌 진짜 요청)
        if (config._dedup) return config;

        // GET 요청만 중복 제거 (POST/PATCH/DELETE 등은 중복 제거 제외)
        if (config.method?.toUpperCase() !== 'GET') return config;

        const key = getRequestKey(config);

        if (pendingRequests.has(key)) {
            // 이미 진행 중인 요청 → reject로 흘려서 응답 인터셉터에서 처리
            return Promise.reject({
                __deduplicated: true,
                promise: pendingRequests.get(key),
            });
        }

        // 최초 요청 → _dedup 플래그 달고 실제 요청 생성 후 Map에 등록
        const dedupConfig: CustomAxiosRequestConfig = { ...config, _dedup: true };
        const promise = StartHubAxios(dedupConfig).finally(() => {
            pendingRequests.delete(key);
        });
        pendingRequests.set(key, promise);

        return Promise.reject({
            __deduplicated: true,
            promise,
        });
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
StartHubAxios.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        if (error.__deduplicated && error.promise) {
            return error.promise;
        }

        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = await getRefToken();
                if (!refresh) throw new Error("리프레시 토큰이 없습니다");

                const response: RefreshResponse = (
                    await axios.post(
                        `${API_URL}user/reissue`,
                        { refresh },
                        { headers: { "X-Platform": "app" } }
                    )
                ).data;

                if (!response.data.access) throw new Error("토큰을 받아오지 못하였습니다");

                await saveAccToken(response.data.access);
                await saveRefToken(response.data.refresh);

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return StartHubAxios(originalRequest);
            } catch (err) {
                await removeTokens();
                popToSigninScreen();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default StartHubAxios;
