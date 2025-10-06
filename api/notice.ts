import StartHubAxios from "../lib/StartHubAxios";
import {GetNoticeResponse, GetNoticesResponse, GetRecommendedNoticeResponse} from "../type/notice/notice.type";

export const getNotices = async (
    title : string,
    supportField : string,
    targetRegion : string,
    targetAge : string,
    businessExperience : string,
    page : number
) : Promise<GetNoticesResponse> =>
    (await StartHubAxios.get('announcements/search', {
        params : {
            title : title,
            supportField : supportField,
            targetRegion : targetRegion,
            targetAge : targetAge,
            businessExperience : businessExperience,
            includeLikeStatus : true,
            page : page,
            size : 15
        }
    })).data

export const getNotice = async (
    announcementId : number
) : Promise<GetNoticeResponse> => 
    (await StartHubAxios.get(`announcements/${announcementId}`, {
        params : {
            includeLikeStatus : true
        }
    })).data;

export const getRecommendedNotices = 
    async () : Promise<GetRecommendedNoticeResponse> =>
    (await StartHubAxios.get(`announcements/recommendations`)).data