import { FC } from "react";
import { Pressable, View } from "react-native";
import { styled } from "nativewind";
import { icons } from "lucide-react-native";

import { useTheme } from "context/ThemeContext";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

const StyledPressable = styled(Pressable);
const StyledView = styled(View);

type IconName = keyof typeof icons;

interface IconLabelProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
  color?: string;
}

const IconLabel: FC<IconLabelProps> = ({ icon, label, onPress, color }) => {
  const { theme } = useTheme();

  const variantsColors = {
    red: "text-red-500",
  };

  return (
    <StyledPressable
      onPress={onPress}
      className="w-full flex-row items-center justify-start mb-2">
      <Icon
        name={icon}
        color={color ? color : theme === "dark" ? "#d4d4d8" : "#3f3f46"}
        size={28}
      />
      <StyledView className="w-2" />
      <Text
        text={label}
        type="large"
        className={
          color ? variantsColors[color] : "text-zinc-700 dark:text-zinc-300"
        }
      />
    </StyledPressable>
  );
};

export default IconLabel;
