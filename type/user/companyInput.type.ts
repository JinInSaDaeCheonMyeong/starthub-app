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

export interface CompanyInputFormData extends EarlyStartupInfo, PreStartupInfo {}