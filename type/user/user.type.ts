import StartupType from "../../constants/StartupType";
import { Response } from "../util/response.type";

export interface GetMeResponse extends Response {
    data : {
        id : number
        username : string
        birth : string
        gender : string
        startupType : StartupType
    }
}

export interface GetUserResponse extends Response {
    data : {
        username : string,
        profileImage : string,
        companyIds : number[]
    }
}