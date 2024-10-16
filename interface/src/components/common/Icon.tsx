import { FC } from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { icons } from "lucide-react-native";

const StyledView = styled(View);

type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  className?: string;
}

const Icon: FC<IconProps> = ({
  name,
  color = "#71717a",
  size = 24,
  className,
  ...props
}) => {
  // eslint-disable-next-line import/namespace
  const LucideIcon = icons[name];
  return (
    <StyledView className={className} {...props}>
      <LucideIcon color={color} size={size} />
    </StyledView>
  );
};

export default Icon;
