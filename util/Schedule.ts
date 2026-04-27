import { useScheduleStore } from "../store/scheduleStore"

export const saveScheduleList = async (scheduleList : number[]) => {
    try {
        await useScheduleStore.getState().setScheduleList(scheduleList)
    } catch (error) {
        throw error
    }
}

export const getScheduleList = async () : Promise<number[]> => {
    try {
        return await useScheduleStore.getState().loadScheduleList()
    } catch (error) {
        throw error
    }
}

export const removeScheduleById = async (id: number): Promise<void> => {
    try {
        await useScheduleStore.getState().removeSchedule(id);
    } catch (error) {
        throw error;
    }
};

export const isScheduleExist = async (id : number) : Promise<boolean> => {
    try {
        return await useScheduleStore.getState().hasSchedule(id)
    } catch (error) {
        return false
    }
}

export const resetScheduleList = async () : Promise<void> => {
    try {
        await useScheduleStore.getState().resetScheduleList()
    } catch(error) {
        throw error
    }
}
