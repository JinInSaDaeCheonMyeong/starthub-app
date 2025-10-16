export interface StartupField {
    businessType : string,
    customField : string
}

export interface CompanyInputFormData {
    startupFields : StartupField[];
    companyName : string;
    companyDescription : string;
    numberOfEmployees : string;
    companyWebsite : string;
    startupLocation : string;
    annualRevenue : string;
}