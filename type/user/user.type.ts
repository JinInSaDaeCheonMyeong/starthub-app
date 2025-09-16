import { InterestType } from "../../constants/InterestType";
import StartupStatus from "../../constants/StartupStatus";
import { Response } from "../util/response.type";

export interface GetMeResponse extends Response {
    data: {
        id : number;
        email : string;
        username : string;
        birth : string;
        gender : string;
        startupStatus : string;
        companyName ?: string;
        companyDescription ?: string;
        numberOfEmployees ?: number;
        companyWebsite ?: string;
        startupLocation ?: string;
        annualRevenue ?: number;
        startupFields ?: string[]
    };
}

export interface GetUserResponse extends Response {
    data : {
        username : string,
        profileImage : string,
        companyIds : number[],
        birth : string;
        gender : string;
        startupStatus : string;
        companyName ?: string;
        companyDescription ?: string;
        numberOfEmployees ?: number;
        companyWebsite ?: string;
        startupLocation ?: string;
        annualRevenue ?: number;
        startupFields ?: string[]
    }
}