import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const ScheduleStorage = {
  SCHEDULE_LIST: "scheduleList",
} as const;

type ScheduleState = {
  scheduleIds: number[];
  initialized: boolean;
  loadScheduleList: () => Promise<number[]>;
  setScheduleList: (scheduleIds: number[]) => Promise<void>;
  removeSchedule: (id: number) => Promise<void>;
  hasSchedule: (id: number) => Promise<boolean>;
  resetScheduleList: () => Promise<void>;
};

const parseScheduleList = (value: string | null): number[] => {
  if (!value) return [];

  const parsed = JSON.parse(value);
  return Array.isArray(parsed)
    ? parsed.filter((item): item is number => typeof item === "number")
    : [];
};

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  scheduleIds: [],
  initialized: false,

  loadScheduleList: async () => {
    const data = await AsyncStorage.getItem(ScheduleStorage.SCHEDULE_LIST);
    const scheduleIds = parseScheduleList(data);
    set({ scheduleIds, initialized: true });
    return scheduleIds;
  },

  setScheduleList: async (scheduleIds) => {
    await AsyncStorage.setItem(
      ScheduleStorage.SCHEDULE_LIST,
      JSON.stringify(scheduleIds)
    );
    set({ scheduleIds, initialized: true });
  },

  removeSchedule: async (id) => {
    const current = get().initialized
      ? get().scheduleIds
      : await get().loadScheduleList();
    const scheduleIds = current.filter((value) => value !== id);
    await get().setScheduleList(scheduleIds);
  },

  hasSchedule: async (id) => {
    const current = get().initialized
      ? get().scheduleIds
      : await get().loadScheduleList();
    return current.some((value) => value === id);
  },

  resetScheduleList: async () => {
    await AsyncStorage.setItem(ScheduleStorage.SCHEDULE_LIST, JSON.stringify([]));
    set({ scheduleIds: [], initialized: true });
  },
}));
