
export interface BaseFCMTokenType {
    token : string
    deviceType : string
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