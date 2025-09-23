import StartHubAxios from "../lib/StartHubAxios";
import {GetNoticesResponse} from "../type/notice/notice.type";

export const postLikes = async (id : number) =>
    (await StartHubAxios.post(`announcements/${id}/likes`))

export const deleteLikes = async (id : number) =>
    (await StartHubAxios.delete(`announcements/${id}/likes`))


export const getLikes = async (page : number) : Promise<GetNoticesResponse> =>
    (await StartHubAxios.get('announcements/likes', {
        params : {
            page : page,
            size : 15
        }
    })).data