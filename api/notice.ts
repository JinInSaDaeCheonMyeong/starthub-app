import StartHubAxios from "../lib/StartHubAxios";
import {GetNoticesResponse} from "../type/notice/notice.type";

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