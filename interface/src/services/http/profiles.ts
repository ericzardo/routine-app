import { z } from "zod";
import Toast from "react-native-toast-message";

import api from "services/api";
import queryClient from "services/queryClient";

import handleError from "./handleError";

import { Profile } from "types/user";

const addProfileSchema = z.object({
  name: z.string().min(3).max(24),
});

type AddProfileData = z.infer<typeof addProfileSchema>;

export const getProfiles = async () => {
  try {
    const response = await api.get<{ profiles: Profile[]; message: string }>(
      "/profiles",
    );

    if (!response.data?.profiles) {
      throw new Error("Failed fetching user profiles");
    }

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const addProfile = async (data: AddProfileData) => {
  try {
    addProfileSchema.parse(data);

    const response = await api.post<{ profile: Profile; message: string }>(
      "/profiles",
      data,
    );

    if (!response.data?.profile) {
      throw new Error("Failed creating a profile");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.invalidateQueries({ queryKey: ["userProfiles"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Profile created successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};
