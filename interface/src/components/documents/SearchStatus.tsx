import { FC } from "react";
import { View } from "lucide-react-native";
import { styled } from "nativewind";

import { useTheme } from "context/ThemeContext";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

const StyledView = styled(View);

interface SearchStatusProps {
  search: string;
}

const SearchStatus: FC<SearchStatusProps> = ({ search }) => {
  const { theme } = useTheme();
  return (
    <StyledView className="w-full flex-row items-center justify-between px-5">
      <StyledView className="flex-row items-center">
        <Icon
          size={20}
          name="Search"
          color={theme === "dark" ? "#52525b" : "#52525b"}
          className="bg-softSage dark:bg-obsidianVeil rounded-full p-1"
        />
        <StyledView className="w-2"></StyledView>
        <Text
          text={search}
          type="medium"
          className="text-zinc-500 dark:text-zinc-600"
        />
      </StyledView>
      <Icon
        size={24}
        name="ArrowUpLeft"
        color={theme === "dark" ? "#52525b" : "#BCC1BA"}
      />
    </StyledView>
  );
};

export default SearchStatus;
