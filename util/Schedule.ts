import AsyncStorage from "@react-native-async-storage/async-storage"
import { ScheduleItem } from "./MarkedDates"

const ScheduleStorage = {
    SCHEDULE_LIST : "scheduleList",
} as const

export const saveScheduleList = async (scheduleList : ScheduleItem[]) => {
    try {
        await AsyncStorage.setItem(ScheduleStorage.SCHEDULE_LIST, JSON.stringify(scheduleList))
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getScheduleList = async () : Promise<ScheduleItem[]> => {
    try {
        const data = await AsyncStorage.getItem(ScheduleStorage.SCHEDULE_LIST)
        if(data !== null)
            return JSON.parse(data)
        else
            return []
    } catch (error) {
        console.error(error)
        throw error
    }
}