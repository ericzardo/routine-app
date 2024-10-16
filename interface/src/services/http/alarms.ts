import { z } from "zod";
import Toast from "react-native-toast-message";

import api from "services/api";
import queryClient from "services/queryClient";

import handleError from "./handleError";

import { Alarm } from "types/user";

const UUIDSchema = z.string().uuid();
const addAlarmSchema = z.object({
  name: z.string().min(1, "The name is required."),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format")
    .refine(time => {
      const [hour, minute] = time.split(":").map(Number);
      return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    }, "Invalid time"),
  repeat: z.string(),
  sound: z.string().optional(),
  isActived: z.boolean(),
});
const editAlarmSchema = z.object({
  name: z.string().min(1, "The name is required."),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format")
    .refine(time => {
      const [hour, minute] = time.split(":").map(Number);
      return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    }, "Invalid time"),
  sound: z.string(),
  repeat: z.string(),
});

type UUID = z.infer<typeof UUIDSchema>;
type AddAlarmData = z.infer<typeof addAlarmSchema>;
type EditAlarmData = z.infer<typeof editAlarmSchema>;

export const toggleAlarm = async (profileId: UUID, alarmId: UUID) => {
  try {
    UUIDSchema.parse(profileId);
    UUIDSchema.parse(alarmId);

    const response = await api.patch<{ alarm: Alarm; message: string }>(
      `${profileId}/alarms/${alarmId}/toggle`,
    );

    if (!response.data?.alarm) {
      throw new Error("Failed activing/desactiving your alarm");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Alarm successfully disabled/enabled!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const addAlarm = async (profileId: UUID, data: AddAlarmData) => {
  try {
    UUIDSchema.parse(profileId);
    addAlarmSchema.parse(data);

    const response = await api.post<{ alarm: Alarm; message: string }>(
      `/${profileId}/alarms`,
      data,
    );

    if (!response.data?.alarm) {
      throw new Error("Failed creating alarm");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Alarm created successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const editAlarm = async (
  profileId: UUID,
  alarmId: UUID,
  data: EditAlarmData,
) => {
  try {
    UUIDSchema.parse(profileId);
    UUIDSchema.parse(alarmId);
    editAlarmSchema.parse(data);

    const response = await api.patch<{ alarm: Alarm; message: string }>(
      `/${profileId}/alarms/${alarmId}`,
      data,
    );

    if (!response.data?.alarm) {
      throw new Error("Failed editing alarm");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Alarm edited successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const deleteAlarm = async (profileId: UUID, alarmId: UUID) => {
  try {
    UUIDSchema.parse(profileId);
    UUIDSchema.parse(alarmId);

    const response = await api.delete<{ alarm: Alarm; message: string }>(
      `/${profileId}/alarms/${alarmId}`,
    );

    if (!response.data?.alarm) {
      throw new Error("Failed deleting alarm");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Alarm deleted successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};
