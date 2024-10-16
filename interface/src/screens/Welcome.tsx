import { FC } from "react";
import { View, Image } from "react-native";
import { styled } from "nativewind";
import Text from "@components/common/Text";

import FacebookLogoImage from "@images/logos/facebook-logo.png";
import GoogleLogoImage from "@images/logos/google-logo.png";
import dailyActivities from "@images/illustrations/daily-activities.png";

import Button from "@components/common/Button";

const StyledView = styled(View);
const StyledImage = styled(Image);

interface WelcomeProps {
  navigation: {
    navigate: (route: string) => void;
  };
}
const Welcome: FC<WelcomeProps> = ({ navigation }) => {
  return (
    <StyledView className="flex-1 flex-col justify-between items-center bg-zinc-50 dark:bg-zinc-900">
      <StyledView className="w-full flex-1 justify-end items-center bg-warmSand dark:bg-obsidianVeil">
        <StyledImage source={dailyActivities} className="object-cover" />
      </StyledView>
      <StyledView className="shadow-sm py-16 flex flex-col items-center">
        <Text
          text="Welcome to Routine"
          type="primary"
          className="text-zinc-600 dark:text-zinc-200"
        />

        <StyledView className="flex flex-col items-center space-y-5 py-5">
          <Button title="Login" onPress={() => navigation.navigate("SignIn")} />
          <StyledView className="" />
          <Button
            title="Sign Up"
            type="border"
            onPress={() => navigation.navigate("CreateAccount")}
          />
        </StyledView>

        <StyledView className="flex-row items-center justify-center gap-2">
          <StyledView className="h-0.5 w-24 bg-softSage dark:bg-stormyTeal" />
          <Text
            text="or login with"
            type="note"
            className="text-paleStone dark:text-ironMoss"
          />
          <StyledView className="h-0.5 w-24 bg-softSage dark:bg-stormyTeal" />
        </StyledView>

        <StyledView className="flex-row items-center justify-center gap-4 py-5">
          <StyledImage
            source={FacebookLogoImage}
            className="w-9 h-9 rounded-full object-cover shadow-sm"
          />
          <StyledImage
            source={GoogleLogoImage}
            className="w-9 h-9 rounded-full object-cover shadow-sm"
          />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default Welcome;
