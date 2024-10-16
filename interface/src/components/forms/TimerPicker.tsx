import { FC } from "react";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";
import { Controller, Control } from "react-hook-form";
import { useTheme } from "context/ThemeContext";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface TimePickerProps {
  initialHour: number;
  initialMinute: number;
  control: Control<any>;
}

const TimePicker: FC<TimePickerProps> = ({
  initialHour = 12,
  initialMinute = 0,
  control,
}) => {
  const { theme } = useTheme();
  return (
    <Controller
      control={control}
      name={"time"}
      defaultValue={`${initialHour}:${initialMinute}`}
      render={({ field: { value, onChange } }) => {
        const [hour, minute] = value.split(":").map(Number);

        const incrementHour = () =>
          onChange(
            `${String((hour + 1) % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
          );
        const decrementHour = () =>
          onChange(
            `${String((hour - 1 + 24) % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
          );
        const incrementMinute = () =>
          onChange(
            `${String(hour).padStart(2, "0")}:${String((minute + 1) % 60).padStart(2, "0")}`,
          );
        const decrementMinute = () =>
          onChange(
            `${String(hour).padStart(2, "0")}:${String((minute - 1 + 60) % 60).padStart(2, "0")}`,
          );

        return (
          <StyledView className="flex-row items-center justify-center">
            <StyledView className="items-center">
              <StyledPressable onPress={incrementHour} className="py-1">
                <Icon
                  name="ChevronUp"
                  color={theme === "dark" ? "#5D615C" : "#BCC1BA"}
                  size={26}
                />
              </StyledPressable>
              <Text
                text={String(hour).padStart(2, "0")}
                type="primary"
                className="text-5xl font-bold text-zinc-800 dark:text-zinc-100"
              />
              <StyledPressable onPress={decrementHour} className="py-1">
                <Icon
                  name="ChevronDown"
                  color={theme === "dark" ? "#5D615C" : "#BCC1BA"}
                  size={26}
                />
              </StyledPressable>
            </StyledView>

            <Text
              text=":"
              type="primary"
              className="text-5xl font-bold text-zinc-800 dark:text-zinc-100 mx-2"
            />

            <StyledView className="items-center">
              <StyledPressable onPress={incrementMinute} className="py-1">
                <Icon
                  name="ChevronUp"
                  color={theme === "dark" ? "#5D615C" : "#BCC1BA"}
                  size={26}
                />
              </StyledPressable>
              <Text
                text={String(minute).padStart(2, "0")}
                type="primary"
                className="text-5xl font-bold text-zinc-800 dark:text-zinc-100"
              />
              <StyledPressable onPress={decrementMinute} className="py-1">
                <Icon
                  name="ChevronDown"
                  color={theme === "dark" ? "#5D615C" : "#BCC1BA"}
                  size={26}
                />
              </StyledPressable>
            </StyledView>
          </StyledView>
        );
      }}
    />
  );
};

export default TimePicker;
