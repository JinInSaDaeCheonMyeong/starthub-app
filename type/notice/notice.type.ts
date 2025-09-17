import {Response} from "../util/response.type";

export interface NoticeTypeTrailer {
    content: BeforeNoticeType[],
    page: number,
    size: number,
    totalPages: number,
    totalElements: number,
    isLast: boolean,
}

export interface GetNoticesResponse extends Response{
    data : NoticeTypeTrailer;
}

export interface BeforeNoticeType {
    id: number,
    title: string,
    url: string,
    organization: string,
    receptionPeriod: string,
    likeCount: number,
    supportField: string,
    targetAge: string,
    contactNumber: string,
    region: string,
    organizationType: string,
    startupHistory: string,
    departmentInCharge: string,
    content: string,
    isLiked: boolean,
}

export interface NoticeType extends BeforeNoticeType {
    startDate: Date;
    endDate: Date;
}