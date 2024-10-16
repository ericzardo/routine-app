import { FC, useState } from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { styled } from "nativewind";
import { useTheme } from "../../context/ThemeContext";

import Text from "@components/common/Text";

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

interface LabeledInputProps extends Omit<TextInputProps, "placeholder"> {
  label: string;
  placeholder: string;
  error?: string;
}

const LabeledInput: FC<LabeledInputProps> = ({
  label,
  placeholder,
  error = "",
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const { theme } = useTheme();

  const getInputStyle = () => {
    if (error) return "border-red-500 text-red-500";
    if (isFocused) return "border-skyBlue text-zinc-700 dark:text-zinc-300";
    return "border-transparent text-zinc-500 dark:text-zinc-600";
  };

  const placeholderTextColor = theme === "dark" ? "#52525b" : "#BCC1BA";

  return (
    <StyledView className="w-full gap-0">
      <Text
        text={label}
        type="secondary"
        className="text-zinc-700 dark:text-zinc-300"
      />
      <StyledTextInput
        className={`w-full h-12 px-4 bg-[#E5E5E5] dark:bg-obsidianVeil border rounded-[10px] font-adlam text-secondary ${getInputStyle()}`}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      {!!error && <Text text={error} type="note" className="text-red-500" />}
    </StyledView>
  );
};

export default LabeledInput;
