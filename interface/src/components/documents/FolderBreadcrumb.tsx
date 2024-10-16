import { FC } from "react";
import { Pressable, View } from "react-native";
import { styled } from "nativewind";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

import { Document } from "types/user";

const StyledPressable = styled(Pressable);
const StyledView = styled(View);

interface FolderBreadcrumbProps {
  path: Document[] | [];
  onGoBack: () => void;
}

const FolderBreadcrumb: FC<FolderBreadcrumbProps> = ({ path, onGoBack }) => {
  return (
    <StyledPressable onPress={onGoBack}>
      <StyledView className="flex-row items-center">
        <Icon size={32} name="ChevronLeft" color="#46B1C9" />
        <Text
          text={path.map(item => item.name).join(" / ")}
          type="medium"
          className="text-zinc-500 dark:text-zinc-500"
        />
      </StyledView>
    </StyledPressable>
  );
};

export default FolderBreadcrumb;
