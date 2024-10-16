import { FC } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { styled } from "nativewind";

import Text from "@components/common/Text";

const StyledPressable = styled(Pressable);

const buttonVariants = {
  size: {
    auto: "flex-1 py-1 px-2",
    medium: "w-64 py-2",
    large: "w-80 py-3",
    full: "w-full py-4",
  },
  type: {
    default: "bg-skyBlue text-white",
    border: "bg-transparent border border-skyBlue text-skyBlue",
    red: "bg-red-500",
  },
};

const textVariants = {
  size: {
    small: "medium",
    medium: "large",
    large: "secondary",
  },
  type: {
    default: "text-white",
    border: "text-skyBlue",
    red: "text-warmSand",
  },
};

type ButtonSize = "auto" | "medium" | "large" | "full";
type ButtonType = "default" | "border" | "red";

interface ButtonProps {
  title: string;
  type?: ButtonType;
  size?: ButtonSize;
  onPress: () => void;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  title,
  type = "default",
  size = "medium",
  onPress,
  isLoading = false,
}) => {
  const sizeClass = buttonVariants.size[size] || buttonVariants.size.medium;
  const typeClass = buttonVariants.type[type] || buttonVariants.type.default;

  const buttonClass = `${sizeClass} ${typeClass} items-center justify-center rounded-lg`;
  const textClass = `${textVariants.type[type] || textVariants.type.default}`;

  return (
    <StyledPressable
      className={buttonClass}
      onPress={!isLoading ? onPress : undefined}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={type === "border" ? "skyBlue" : "white"}
        />
      ) : (
        <Text
          text={title}
          type={textVariants.size[type]}
          className={textClass}
        />
      )}
    </StyledPressable>
  );
};

export default Button;
