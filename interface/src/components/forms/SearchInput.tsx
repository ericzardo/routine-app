import { FC } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { styled } from "nativewind";
import { useTheme } from "context/ThemeContext";

import Icon from "../common/Icon";

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

interface SearchInputProps extends Omit<TextInputProps, "onChange"> {
  placeholder: string;
  onChange: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
}

const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  onChange,
  ...textInputProps
}) => {
  const { theme } = useTheme();

  const placeholderTextColor = theme === "dark" ? "#52525b" : "#52525b";

  return (
    <StyledView className="w-full flex-row items-center justify-between bg-softSage dark:bg-obsidianVeil px-1.5 py-1 my-3 rounded-xl shadow">
      <StyledTextInput
        className="flex-1 px-4 py-1 bg-softSage dark:bg-obsidianVeil text-zinc-500 dark:text-zinc-300 rounded-xl font-adlam text-medium"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChange={onChange}
        {...textInputProps}
      />
      <Icon
        size={24}
        name="Search"
        color={theme === "dark" ? "#52525b" : "#52525b"}
      />
    </StyledView>
  );
};

export default SearchInput;
