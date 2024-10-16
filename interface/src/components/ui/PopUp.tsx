import { FC, ReactNode } from "react";
import { View, Modal as RNModal } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledModal = styled(RNModal);

interface PopUpProps {
  children: ReactNode;
  onClose: () => void;
}

const PopUp: FC<PopUpProps> = ({ children, onClose }) => {
  return (
    <StyledModal
      transparent
      animationType="slide"
      visible={true}
      onRequestClose={onClose}>
      <StyledView className="absolute top-0 left-0 right-0 bottom-0 z-40 bg-zinc-950/50 bg-opacity-40 items-center justify-center">
        <StyledView className="w-80 px-6 py-5 bg-zinc-50 dark:bg-zinc-900 shadow-2xl z-50 rounded-xl items-center">
          {children}
        </StyledView>
      </StyledView>
    </StyledModal>
  );
};

export default PopUp;
