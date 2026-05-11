import axios from "axios";
import { API_URL } from "../util/apiUrl";
import {
    AppleOAuthRequest,
    GoogleOAuthRequest,
    OAuthLoginResponse,
    OAuthStateResponse,
} from "../type/oauth/oauth.type";

const OAUTH_HEADERS = { "X-Platform": "app" };

export const getOAuthState = async (): Promise<OAuthStateResponse> =>
    (await axios.get(`${API_URL}oauth/state`, { headers: OAUTH_HEADERS })).data;

export const googleOAuthApp = async ({
    code,
    state,
    platform,
    codeVerifier,
}: GoogleOAuthRequest): Promise<OAuthLoginResponse> =>
    (
        await axios.get(`${API_URL}oauth/google/app`, {
            headers: OAUTH_HEADERS,
            params: {
                code,
                state,
                platform,
                codeVerifier,
            },
        })
    ).data;

export const appleOAuthApp = async ({
    idToken,
}: AppleOAuthRequest): Promise<OAuthLoginResponse> =>
    (
        await axios.post(
            `${API_URL}oauth/apple/app`,
            { idToken },
            { headers: OAUTH_HEADERS }
        )
    ).data;
