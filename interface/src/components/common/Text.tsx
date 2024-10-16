import { FC } from "react";
import { Text } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);

type TextType =
  | "primary"
  | "secondary"
  | "large"
  | "medium"
  | "small"
  | "caption"
  | "note";

interface TextProps {
  text: string;
  type?: TextType;
  className?: string;
}

const AdlamText: FC<TextProps> = ({ text, type = "medium", ...props }) => {
  const textVariants = {
    primary: "text-[32px]",
    secondary: "text-[20px]",
    large: "text-[18px]",
    medium: "text-[16px]",
    small: "text-[14px]",
    caption: "text-[12px]",
    note: "text-[10px]",
  };
  const textClass = `font-adlam ${textVariants[type]}`;
  return (
    <StyledText className={textClass} {...props}>
      {text}
    </StyledText>
  );
};

export default AdlamText;
