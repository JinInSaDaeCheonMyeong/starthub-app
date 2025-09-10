import StartupType from "../../constants/StartupType"

export interface UserInfo {
    name : string,
    year : string,
    month : string,
    day : string,
} 

export interface TypeInfo {
    gender : string,
    startupType : StartupType
}

export interface EarlyStartupInfo {
    companyName : string;
    companyIntro : string;
    personNumber : string;
    companySite : string;
    getMoneyYear : string;
    earlyCompanyLocation : string;
    earlyInterestList : string[];
}

export interface PreStartupInfo {
    preCompanyLocation : string;
    preInterestList : string[];
}


export interface SignupInputRequest{
    name : string,
    date : Date,
    location : string,
    interestList : string[]
}

export interface SignupInputFormData extends UserInfo, TypeInfo, EarlyStartupInfo, PreStartupInfo {}