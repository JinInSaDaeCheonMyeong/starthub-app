import { create } from "zustand";
import { getMe } from "../api/user";
import { GetMeResponse, ProfileProvider } from "../type/user/user.type";

type ProfileData = GetMeResponse["data"];

type ProfileState = {
  profileData?: ProfileData;
  profileProvider: ProfileProvider;
  loading: boolean;
  setProfileData: (profileData?: ProfileData) => void;
  fetchProfile: () => Promise<ProfileData>;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profileData: undefined,
  profileProvider: "LOCAL",
  loading: false,

  setProfileData: (profileData) => {
    set({
      profileData,
      profileProvider: profileData?.provider ?? "LOCAL",
    });
  },

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const profileData = (await getMe()).data;
      set({
        profileData,
        profileProvider: profileData.provider,
      });
      return profileData;
    } finally {
      set({ loading: false });
    }
  },

  clearProfile: () => {
    set({
      profileData: undefined,
      profileProvider: "LOCAL",
      loading: false,
    });
  },
}));
