import { Response } from "../util/response.type";

export type OAuthLoginData = {
    access: string;
    refresh: string;
    isFirstLogin: boolean;
};

export type OAuthStateResponse = Omit<Response, "data"> & {
    data: string;
};

export interface OAuthLoginResponse extends Response {
    data: OAuthLoginData;
}

export type GoogleOAuthRequest = {
    code: string;
    state: string;
    platform: string;
    codeVerifier: string;
};

export type AppleOAuthRequest = {
    idToken: string;
};
