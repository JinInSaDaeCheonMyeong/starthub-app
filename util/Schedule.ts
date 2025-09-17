import AsyncStorage from "@react-native-async-storage/async-storage"
import { NoticeType } from "../type/notice/notice.type"

const ScheduleStorage = {
    SCHEDULE_LIST : "scheduleList",
} as const

export const saveScheduleList = async (scheduleList : NoticeType[]) => {
    try {
        const json = JSON.stringify(scheduleList);
        await AsyncStorage.setItem(ScheduleStorage.SCHEDULE_LIST, json)
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getScheduleList = async () : Promise<NoticeType[]> => {
    try {
        const data = await AsyncStorage.getItem(ScheduleStorage.SCHEDULE_LIST)
        if(data !== null) {
            const json = JSON.parse(data)
            return json
        }
        else
            return []
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const removeScheduleById = async (id: number): Promise<void> => {
    try {
        const data = await getScheduleList();
        const filtered = data.filter((value) => value.id !== id);
        await saveScheduleList(filtered);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const isScheduleExist = async (id : number) : Promise<boolean> => {
    try {
        const scheduleList = await getScheduleList()
        return scheduleList.some((item) => item.id === id);
    } catch (error) {
        console.error(error);
        return false
    }
}

export const resetScheduleList = async () : Promise<void> => {
    try {
        await AsyncStorage.setItem(ScheduleStorage.SCHEDULE_LIST, JSON.stringify([]))
    } catch(error) {
        console.error(error);
        throw error
    }
}