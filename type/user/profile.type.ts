import { InterestType } from "../../constants/InterestType"

export interface SetProfileRequest {
    username: string;
    birth: string;
    gender: string;
    startupFields?: string[];
    startupStatus: string;
    companyName?: string;
    companyDescription?: string;
    numberOfEmployees?: number;
    companyWebsite?: string;
    startupLocation?: string;
    annualRevenue?: number;
}