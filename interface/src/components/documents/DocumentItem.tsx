import { View, Pressable } from "react-native";
import { styled } from "nativewind";
import { format } from "date-fns";

import { useTheme } from "context/ThemeContext";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

import { Document as DocumentType } from "types/user";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface DocumentProps {
  document: DocumentType;
  onPress?: () => void;
  handleItem: (document: DocumentType) => void;
}

const Document = ({ document, onPress, handleItem }: DocumentProps) => {
  const { theme } = useTheme();
  return (
    <StyledPressable
      className="flex-row items-center justify-between my-2 w-full"
      onPress={onPress}>
      <StyledView className="flex-row">
        <Icon
          size={36}
          name={document.type.toLowerCase() === "folder" ? "Folder" : "File"}
          color="#46B1C9"
        />
        <StyledView className="w-2" />
        <StyledView>
          <Text
            text={document.name}
            type="medium"
            className="text-zinc-800 dark:text-zinc-200"
          />
          <StyledView className="h-1" />
          <Text
            text={`Modified ${format(document.modified, "PP")}`}
            type="caption"
            className="text-zinc-500 dark:text-ironMoss"
          />
        </StyledView>
      </StyledView>
      <StyledPressable onPress={() => handleItem(document)}>
        <Icon
          size={22}
          name="Ellipsis"
          color={theme === "dark" ? "#5D615C" : "#52525b"}
        />
      </StyledPressable>
    </StyledPressable>
  );
};

export default Document;
