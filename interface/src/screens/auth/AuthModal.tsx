import { FC, ReactNode } from "react";
import { View, Image } from "react-native";
import { styled } from "nativewind";
import Text from "@components/common/Text";

import dailyActivities from "@images/illustrations/daily-activities.png";

import Button from "@components/common/Button";

const StyledView = styled(View);
const StyledImage = styled(Image);

interface AuthModalProps {
  title: string;
  buttonTitle: string;
  onSubmit: () => void;
  children?: ReactNode;
  isSubmiting?: boolean;
}

const AuthModal: FC<AuthModalProps> = ({
  title,
  buttonTitle,
  onSubmit,
  children,
  isSubmiting = false,
}) => {
  return (
    <StyledView className="flex-1 flex-col justify-between items-center bg-zinc-50 dark:bg-zinc-950">
      <StyledView className="w-full flex-1 justify-end items-center bg-warmSand dark:bg-obsidianVeil">
        <StyledImage source={dailyActivities} className="object-cover" />
      </StyledView>
      <StyledView className="shadow-sm pt-8 pb-28 px-9 w-full space-y-5">
        <Text text={title} type="large" className="text-oceanMist" />

        <StyledView className="w-full">{children}</StyledView>

        <StyledView className="w-full">
          <Button
            title={buttonTitle}
            size="full"
            onPress={onSubmit}
            isLoading={isSubmiting}
          />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default AuthModal;
