import { Response } from "../util/response.type";

export interface BaseScheduleType {
    announcementId : 20
    startDate : string
    endDate : string
}

export interface MonthScheduleType extends BaseScheduleType {
    supportFields : string
}

export interface GetMonthScheduleResponse extends Response {
    data : MonthScheduleType[]
}

export interface GetDateSchedulesResponse extends Response {
    data : {
        id : number
        title : string
        organization : string
        receptionPeriod: string,
        likeCount : number
    }
}