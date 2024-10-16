import { FC } from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import PopUp from "@components/ui/PopUp";
import Button from "@components/common/Button";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

import { Alarm, Document } from "types/user";

const StyledView = styled(View);

interface DeleteItemProps {
  item: Alarm | Document;
  label: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteItem: FC<DeleteItemProps> = ({
  item,
  label,
  onClose,
  onDelete,
}) => {
  return (
    <PopUp onClose={onClose}>
      <Icon size={50} name="OctagonAlert" color="#ef4444" />
      <StyledView className="px-5">
        <Text
          text={label}
          type="large"
          className="text-zinc-700 dark:text-zinc-300 text-center"
        />
      </StyledView>

      <StyledView className="mb-4 mt-3">
        <Text
          text={item.name}
          type="small"
          className="text-softSage dark:text-ironMoss py-2 text-center"
        />
      </StyledView>

      <StyledView className="flex-row">
        <Button title="Cancel" type="border" size="auto" onPress={onClose} />
        <StyledView className="w-2" />
        <Button title="Delete" type="red" size="auto" onPress={onDelete} />
      </StyledView>
    </PopUp>
  );
};

export default DeleteItem;
