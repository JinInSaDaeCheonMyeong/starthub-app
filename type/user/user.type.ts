import { Response } from "../util/response.type";
import { StartupField } from "./companyInput.type";

export type ProfileProvider = "LOCAL" | "GOOGLE" | "APPLE"

export interface GetMeResponse extends Response {
    data: {
        id: number;
        email: string;
        username: string;
        birth: string;
        gender: string;
        startupStatus: string;
        companyName?: string;
        companyDescription?: string;
        numberOfEmployees?: number;
        companyWebsite?: string;
        startupLocation?: string;
        annualRevenue?: number;
        startupFields?: StartupField[];
        startupHistory ?: number;
        provider: ProfileProvider;
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
        startupFields ?: StartupField[]
    }
}
