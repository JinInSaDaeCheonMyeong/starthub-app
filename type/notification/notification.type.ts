
export type DeviceType = "ANDROID" | "IOS" | "ANDROID_TABLET" | "IPADOS" | "UNKNOWN";

export interface BaseFCMTokenType {
    token : string
    deviceType : DeviceType
}

export interface MyFCMToken extends BaseFCMTokenType {
    id : number
    createAt : string
}

export interface PostFCMTokenRequest extends BaseFCMTokenType {
}

export interface GetFCMTokensRespons extends Response {
    data : MyFCMToken[]
} 

export interface AlarmHistory {
    id : number,
    announcementId : number,
    notificationType : string,
    title : string,
    body : string,
    isSent : boolean,
    createdAt : string
}

export interface GetAlarmHistoryResponse extends Response {
    data : AlarmHistory[]
}