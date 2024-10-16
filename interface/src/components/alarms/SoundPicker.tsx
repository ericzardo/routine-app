import { FC } from "react";
import { Pressable, View } from "react-native";
import { styled } from "nativewind";

import Modal from "@components/ui/Modal";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

interface SoundProps {
  sound: string;
  handleGoBack: () => void;
  handleSound: (sound: string) => void;
}

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

const Sound: FC<SoundProps> = ({
  sound: currentSound,
  handleGoBack,
  handleSound,
}) => {
  const sounds = ["Default", "Openning", "Waves"];

  return (
    <Modal title="Alarm Sound" onClose={handleGoBack} withHeader="back">
      <StyledView className="flex-col bg-warmSand dark:bg-obsidianVeil rounded-lg px-2 py-2 mt-6">
        {sounds.map(sound => (
          <StyledPressable
            key={sound}
            className="flex-row items-center border-b last:border-none border-softSage dark:border-stormyTeal"
            onPress={() => handleSound(sound)}>
            <StyledView className="w-5 flex-row items-center justify-center">
              {sound === currentSound && (
                <Icon name="Check" color="#46B1C9" size={20} />
              )}
            </StyledView>

            <StyledView className="px-3 py-1">
              <Text
                text={sound}
                type="medium"
                className="text-zinc-500 dark:text-zinc-500"
              />
            </StyledView>
          </StyledPressable>
        ))}
      </StyledView>
    </Modal>
  );
};

export default Sound;
