import { FC } from "react";
import { Control, Controller } from "react-hook-form";

import Modal from "@components/ui/Modal";
import LabeledInput from "@components/forms/LabeledInput";

interface InputModalProps {
  title: string;
  label?: string;
  placeholder?: string;
  control: Control<any>;
  inputName: string;
  onClose: () => void;
  onSave?: () => void;
  withHeader?: "back" | "save";
}

const InputModal: FC<InputModalProps> = ({
  title,
  label = "",
  placeholder = "",
  control,
  inputName,
  onClose,
  onSave,
  withHeader = "back",
}) => {
  return (
    <Modal
      title={title}
      onClose={onClose}
      onSave={onSave}
      withHeader={withHeader}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <LabeledInput
            label={label}
            placeholder={placeholder}
            onChangeText={onChange}
            value={value}
          />
        )}
        name={inputName}
      />
    </Modal>
  );
};

export default InputModal;
