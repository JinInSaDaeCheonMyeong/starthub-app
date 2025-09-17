import StartupStatus from "../../constants/StartupStatus"

export interface UserInfo {
    name : string,
    year : string,
    month : string,
    day : string,
} 

export interface TypeInfo {
    gender : string,
    startupType : StartupStatus
}

export interface SignupInputRequest{
    name : string,
    date : Date,
    location : string,
    interestList : string[]
}

export interface SignupInputFormData extends UserInfo, TypeInfo {}