import { View, Pressable } from "react-native";
import { styled } from "nativewind";
import { format } from "date-fns";
import { useTheme } from "context/ThemeContext";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

import { Alarm as AlarmType } from "types/user";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface AlarmProps {
  alarm: AlarmType;
  onPress: (item: AlarmType) => void;
  handleActiveAlarm: (item: AlarmType) => void;
}

const Alarm = ({ alarm, onPress, handleActiveAlarm }: AlarmProps) => {
  const { theme } = useTheme();
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <StyledPressable
      onPress={() => onPress(alarm)}
      className={`flex-row items-center justify-between my-2 bg-softSage dark:bg-obsidianVeil px-4 py-2 rounded-lg ${
        alarm.isActive ? "opacity-100" : "opacity-60"
      }`}>
      <StyledView>
        <Text
          text={alarm.name}
          type="medium"
          className="text-zinc-600 dark:text-zinc-300"
        />
        <Text
          text={format(alarm.time, "HH:mm")}
          type="primary"
          className="text-zinc-800 dark:text-zinc-100"
        />
        <StyledView className="flex-row space-x-2 mt-1">
          {weekDays.map(day => (
            <Text
              key={day}
              text={day.slice(0, 3)}
              type="caption"
              className={
                alarm.repeat?.includes(day)
                  ? "text-skyBlue"
                  : "text-zinc-500 dark:text-zinc-400"
              }
            />
          ))}
        </StyledView>
      </StyledView>
      <StyledPressable onPress={() => handleActiveAlarm(alarm)}>
        <Icon
          name={alarm.isActive ? "Bell" : "BellOff"}
          color={
            alarm.isActive
              ? "#46B1C9"
              : theme === "dark"
                ? "#a1a1aa"
                : "#52525b"
          }
          size={40}
        />
      </StyledPressable>
    </StyledPressable>
  );
};

export default Alarm;
