import StartupType from "../../constants/StartupType";
import { Response } from "../util/response.type";

export interface GetMeResponse extends Response {
    data : {
        id : number
        username : string
        birth : string
        gender : string
        startupType : StartupType;
        earlyStartup ?: EarlyStartupData
        preStartup ?: PreStartupData
    }
}

export interface GetUserResponse extends Response {
    data : {
        username : string,
        profileImage : string,
        companyIds : number[]
    }
}

export interface EarlyStartupData {
    companyName : string
    companyIntro ?: string
    personNumber : number
    companySite ?: string
    getMoneyYear : number
    companyLocation ?: string
}

export interface PreStartupData {
    companyLocation : string
}