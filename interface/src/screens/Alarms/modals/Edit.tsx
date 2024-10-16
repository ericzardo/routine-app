import { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";
import { format } from "date-fns";

import { useTheme } from "context/ThemeContext";
import { useProfile } from "context/ProfileContext";
import { deleteAlarm, editAlarm } from "services/http/alarms";

import InputModal from "@components/modals/Input";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";
import Modal from "@components/ui/Modal";

import TimePicker from "@components/forms/TimerPicker";
import EditSound from "@components/alarms/SoundPicker";
import DeleteItem from "@components/modals/Delete";

import { Alarm } from "types/user";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

const alarmSchema = z.object({
  name: z.string().min(1, "The title is required."),
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

type AlarmFormData = z.infer<typeof alarmSchema>;

interface EditAlarmProps {
  alarm: Alarm;
  onClose: () => void;
}

const EditAlarm: FC<EditAlarmProps> = ({ alarm, onClose }) => {
  const { theme } = useTheme();
  const { profile } = useProfile();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(prev => !prev);
  }, []);

  const { control, handleSubmit, setValue, watch, getValues } =
    useForm<AlarmFormData>({
      resolver: zodResolver(alarmSchema),
      defaultValues: {
        name: alarm.name || "Alarm",
        sound: alarm.sound || "Without",
        time: format(alarm.time, "HH:mm") || "12:00",
        repeat: alarm.repeat,
      },
    });

  const [modalStep, setModalStep] = useState<"edit" | "name" | "sound">("edit");

  const name = watch("name");
  const repeat = watch("repeat");

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleToggleDay = useCallback(
    (day: string) => {
      const prevRepeat = getValues("repeat").split(" ") || [];
      const updatedRepeat = prevRepeat.includes(day)
        ? prevRepeat.filter(d => d !== day)
        : [...prevRepeat, day];

      setValue("repeat", updatedRepeat.join(" "));
    },
    [getValues, setValue],
  );

  const handleGoBack = useCallback(() => {
    setModalStep("edit");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!profile) return;

    await deleteAlarm(profile.id, alarm.id);

    onClose();
  }, [alarm.id, profile, onClose]);

  const handleEditAlarm = useCallback(() => {
    if (!profile) return;
    handleSubmit(async data => {
      await editAlarm(profile.id, alarm.id, data);

      onClose();
    })();
  }, [handleSubmit, profile, alarm.id, onClose]);

  return isDeleteModalOpen ? (
    <DeleteItem
      item={alarm}
      label={`Are you sure you want to delete this Alarm?`}
      onClose={handleDeleteModal}
      onDelete={handleDelete}
    />
  ) : modalStep === "edit" ? (
    <Modal
      onClose={onClose}
      title="Edit Alarm"
      onSave={handleEditAlarm}
      withHeader="save">
      <TimePicker
        initialHour={Number(getValues("time").split(":")[0])}
        initialMinute={Number(getValues("time").split(":")[1])}
        control={control}
      />
      <StyledView className="flex-row items-center justify-evenly">
        {weekDays.map((day, index) => (
          <StyledPressable key={index} onPress={() => handleToggleDay(day)}>
            <Text
              text={day.slice(0, 3)}
              type="small"
              className={`text-zinc-700 dark:text-zinc-400 rounded-full px-1.5 py-0.5 ${
                repeat.split(" ")?.includes(day)
                  ? "bg-oceanMist dark:text-zinc-700"
                  : "bg-transparent"
              }`}
            />
          </StyledPressable>
        ))}
      </StyledView>

      <StyledView className="flex-col bg-warmSand dark:bg-obsidianVeil rounded-lg px-2 py-2 mt-6">
        <StyledPressable
          className="flex-row justify-between items-center"
          onPress={() => setModalStep("name")}>
          <Text
            text="Name"
            type="medium"
            className="text-zinc-500 dark:text-zinc-500"
          />
          <StyledView className="flex-row items-center">
            <Text
              text={name}
              type="medium"
              className="text-softSage dark:text-ironMoss"
            />
            <StyledView className="w-1" />
            <Icon
              name="ChevronRight"
              color={theme === "dark" ? "#5D615C" : "#BCC1BA"}
              size={18}
            />
          </StyledView>
        </StyledPressable>
        <StyledView className="h-2" />
        <StyledPressable
          className="flex-row justify-between items-center"
          onPress={() => setModalStep("sound")}>
          <Text
            text="Sound"
            type="medium"
            className="text-zinc-500 dark:text-zinc-500"
          />
          <StyledView className="flex-row items-center">
            <Text
              text={getValues("sound")}
              type="medium"
              className="text-softSage dark:text-ironMoss"
            />
            <StyledView className="w-1" />
            <Icon
              name="ChevronRight"
              color={theme === "dark" ? "#5D615C" : "#BCC1BA"}
              size={18}
            />
          </StyledView>
        </StyledPressable>
      </StyledView>

      <StyledView className="pt-10">
        <StyledPressable
          onPress={handleDeleteModal}
          className="flex-row justify-center items-center">
          <Icon name="Trash" size={20} color="#ef4444" />
          <StyledView className="w-2" />
          <Text text="Delete Alarm" type="small" className="text-red-500" />
        </StyledPressable>
      </StyledView>
    </Modal>
  ) : modalStep === "name" ? (
    <InputModal
      title="Alarm Name"
      label="Rename"
      placeholder={alarm.name}
      onClose={handleGoBack}
      control={control}
      inputName="name"
    />
  ) : (
    modalStep === "sound" && (
      <EditSound
        handleGoBack={handleGoBack}
        handleSound={sound => setValue("sound", sound)}
        sound={watch("sound")}
      />
    )
  );
};

export default EditAlarm;
