import StartHubAxios from "../lib/StartHubAxios";
import { GetAlarmHistoryResponse, GetFCMTokensRespons, PostFCMTokenRequest } from "../type/notification/notification.type";
import { Response } from "../type/util/response.type";
import { Platform } from "react-native";

const BASE_ENDPOINT = '/notifications/fcm-token'

export const registerFCMToken = async (data : PostFCMTokenRequest) : Promise<Response> => 
    (await StartHubAxios.post(BASE_ENDPOINT, data)).data

export const removeFCMToken = async (token : string) : Promise<Response> => 
    (await StartHubAxios.delete(BASE_ENDPOINT, {params : {token}})).data

export const getMyFCMTokens = async () : Promise<GetFCMTokensRespons> => 
    (await StartHubAxios.get(BASE_ENDPOINT + 's')).data

Platform.OS

export const getAlarmHistory = async () : Promise<GetAlarmHistoryResponse> => 
    (await StartHubAxios.get('notifications/history')).data