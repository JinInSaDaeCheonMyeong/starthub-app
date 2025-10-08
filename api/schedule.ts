import StartHubAxios from "../lib/StartHubAxios";
import { BaseScheduleType, GetDateSchedulesResponse, GetMonthScheduleResponse } from "../type/schedules/schedules.type";
import { Response } from "../type/util/response.type";

const SCHEDULE_ENDPOINT = "/schedules"

export const registerSchedules = async (data : BaseScheduleType) : Promise<Response>=> 
    (await StartHubAxios.post(SCHEDULE_ENDPOINT, data)).data

export const getMonthSchedules = async (date : string): Promise<GetMonthScheduleResponse> => 
    (await StartHubAxios.get(SCHEDULE_ENDPOINT + "/month", {params : {date : date}})).data

export const getDateSchedules = async (date: string): Promise<GetDateSchedulesResponse> =>
    (await StartHubAxios.get(SCHEDULE_ENDPOINT + "/date", {params : {date : date}})).data;

export const removeSchedules = async (announcementId : number) : Promise<Response> => 
    (await StartHubAxios.delete(SCHEDULE_ENDPOINT, {params : {announcementId}})).data