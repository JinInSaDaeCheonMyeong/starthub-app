import StartHubAxios from "../lib/StartHubAxios";
import {GetNoticesResponse} from "../type/notice/notice.type";

export const getNotices = async (page : number) : Promise<GetNoticesResponse> =>
    (await StartHubAxios.get('announcements', {
        params : {
            page : page,
            size : 15
        }
    })).data