import StartHubAxios from "../lib/StartHubAxios";

export const postLikes = async (id : number) =>
    (await StartHubAxios.post(`announcements/${id}/likes`))

export const deleteLikes = async (id : number) =>
    (await StartHubAxios.delete(`announcements/${id}/likes`))