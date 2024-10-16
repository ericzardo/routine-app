import AsyncStorage from "@react-native-async-storage/async-storage";

import { Profile } from "types/user";

const PROFILE_KEY = "current_profile";

export const storeProfile = async (profile: Profile) => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Error storing the profile:", error);
  }
};

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const profile = await AsyncStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error("Error retrieving the profile:", error);
    return null;
  }
};

export const removeProfile = async () => {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error("Error removing the profile:", error);
  }
};
