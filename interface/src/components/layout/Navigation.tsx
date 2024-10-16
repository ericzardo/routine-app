import { FC } from "react";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";

import { useTheme } from "context/ThemeContext";

import { icons } from "lucide-react-native";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

type IconName = keyof typeof icons;

interface MenuItem {
  name: string;
  icon: IconName;
  color: string;
}

interface NavigationProps {
  activeIndex?: number;
  onSelect: (index: number) => void;
  items: MenuItem[];
}

const Navigation: FC<NavigationProps> = ({
  activeIndex = 0,
  onSelect,
  items,
}) => {
  const { theme } = useTheme();
  return (
    <StyledView className="bg-zinc-100/50 dark:bg-zinc-900/20 flex-row justify-between w-full shadow">
      {items.map((item, index) => (
        <StyledPressable
          key={item.name}
          onPress={() => onSelect(index)}
          className={`py-4 items-center justify-center flex-1 ${index === activeIndex ? "border-t border-skyBlue" : ""}`}>
          <Icon
            size={32}
            name={item.icon}
            color={
              index === activeIndex
                ? item.color
                : theme === "dark"
                  ? "#a1a1aa"
                  : "#71717a"
            }
          />
          <StyledView className="h-1.5" />
          <Text
            text={item.name}
            type="medium"
            className={`${index === activeIndex ? "text-skyBlue" : "text-zinc-500 dark:text-zinc-400"}`}
          />
        </StyledPressable>
      ))}
    </StyledView>
  );
};

export default Navigation;
