import { BeforeNoticeType } from "../notice/notice.type";
import { Response } from "../util/response.type";

export interface BaseScheduleType {
    announcementId : number
    startDate : string
    endDate : string
}

export interface MonthScheduleType extends BaseScheduleType {
    supportField : string
}

export interface GetMonthScheduleResponse extends Response {
    data : MonthScheduleType[]
}

export interface GetDateSchedulesResponse extends Response {
    data : BeforeNoticeType[]
}