import { useCallback, useState, FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";

import { useTheme } from "context/ThemeContext";
import { useProfile } from "context/ProfileContext";
import { addAlarm } from "services/http/alarms";

import InputModal from "@components/modals/Input";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";
import Modal from "@components/ui/Modal";

import TimePicker from "@components/forms/TimerPicker";
import EditSound from "@components/alarms/SoundPicker";

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
  repeat: z.string(),
  sound: z.string().optional(),
  isActived: z.boolean(),
});

type AlarmFormData = z.infer<typeof alarmSchema>;

interface AddAlarmsProps {
  onClose: () => void;
}

const AddAlarm: FC<AddAlarmsProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { profile } = useProfile();

  const { control, getValues, setValue, watch, handleSubmit } =
    useForm<AlarmFormData>({
      resolver: zodResolver(alarmSchema),
      defaultValues: {
        name: "Alarm",
        sound: "Default",
        repeat: "",
        time: "12:00",
        isActived: true,
      },
    });

  const [modalStep, setModalStep] = useState<"add" | "name" | "sound">("add");

  const repeat = watch("repeat");
  const title = watch("name");
  const time = watch("time");

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
    setModalStep("add");
  }, []);

  const handleAddAlarm = useCallback(() => {
    if (!profile) return;
    handleSubmit(async data => {
      await addAlarm(profile.id, data);

      onClose();
    })();
  }, [handleSubmit, profile, onClose]);

  return (
    <Modal
      onClose={onClose}
      title="Add Alarm"
      onSave={handleAddAlarm}
      withHeader="save">
      {modalStep === "add" && (
        <>
          <TimePicker
            initialHour={parseInt((time || "12:00").split(":")[0], 10)}
            initialMinute={parseInt((time || "12:00").split(":")[1], 10)}
            control={control}
          />
          <StyledView className="flex-row items-center justify-evenly">
            {weekDays.map((day, index) => (
              <StyledPressable key={index} onPress={() => handleToggleDay(day)}>
                <Text
                  text={day.slice(0, 3)}
                  type="small"
                  className={`text-zinc-700 dark:text-zinc-400 rounded-full px-1.5 py-0.5 ${
                    repeat?.includes(day)
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
                  text={title}
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
                  text={getValues("sound") || "Default"}
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
        </>
      )}

      {modalStep === "name" && (
        <InputModal
          title="Alarm Name"
          control={control}
          onClose={handleGoBack}
          inputName="name"
        />
      )}

      {modalStep === "sound" && (
        <EditSound
          handleGoBack={handleGoBack}
          handleSound={sound => setValue("sound", sound)}
          sound={watch("sound") || "Default"}
        />
      )}
    </Modal>
  );
};

export default AddAlarm;
