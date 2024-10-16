import { FC, ReactNode } from "react";
import { View, Pressable, Modal as RNModal } from "react-native";
import { styled } from "nativewind";

import Text from "@components/common/Text";
import Icon from "../common/Icon";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledModal = styled(RNModal);

interface ModalProps {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  onSave?: () => void;
  withHeader?: "back" | "save" | null;
}

const Modal: FC<ModalProps> = ({
  children,
  onClose,
  onSave,
  title = "",
  withHeader = null,
}) => {
  return (
    <StyledModal
      transparent
      animationType="slide"
      visible={true}
      onRequestClose={onClose}>
      <StyledView className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-zinc-950/50 bg-opacity-40 flex-1 justify-end">
        <StyledPressable
          className="absolute top-0 left-0 right-0 bottom-0"
          onPress={onClose}
        />

        <StyledView className="w-full px-6 pt-4 pb-14 bg-zinc-50 dark:bg-zinc-900 shadow-2xl z-50 rounded-t-lg">
          {withHeader === "save" && (
            <StyledView className="flex-row items-center justify-between mb-5">
              <StyledPressable onPress={onClose}>
                <Text text="Cancel" type="large" className="text-skyBlue" />
              </StyledPressable>

              <Text
                text={title}
                type="secondary"
                className="text-zinc-700 dark:text-zinc-300 flex-1 text-center"
              />

              <StyledPressable onPress={onSave}>
                <Text text="Save" type="large" className="text-skyBlue" />
              </StyledPressable>
            </StyledView>
          )}

          {withHeader === "back" && (
            <StyledView className="flex-row items-center mb-7">
              <StyledPressable
                className="flex-row items-center"
                onPress={onClose}>
                <Icon name="ChevronLeft" size={22} color="#46B1C9" />
                <Text text="Back" type="large" className="text-skyBlue" />
              </StyledPressable>

              <Text
                text="Alarm Sound"
                type="secondary"
                className="flex-1 pr-16 text-zinc-700 dark:text-zinc-300 text-center"
              />
            </StyledView>
          )}

          <StyledView className="w-full pb-72">{children}</StyledView>
        </StyledView>
      </StyledView>
    </StyledModal>
  );
};

export default Modal;
