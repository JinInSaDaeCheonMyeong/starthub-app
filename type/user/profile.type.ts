import { StartupField } from "./companyInput.type";

export interface SetProfileRequest {
    username : string;
    birth : string;
    gender : string;
    startupFields ?: StartupField[];
    startupStatus : string;
    companyName ?: string;
    companyDescription ?: string;
    numberOfEmployees ?: number;
    companyWebsite ?: string;
    startupLocation ?: string;
    annualRevenue ?: number;
    startupHistory ?: number;
}