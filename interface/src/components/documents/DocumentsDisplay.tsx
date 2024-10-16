import { Fragment, FC } from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import DocumentItem from "@components/documents/DocumentItem";
import Text from "@components/common/Text";

import { Document } from "types/user";

const StyledView = styled(View);

interface DocumentsDisplayProps {
  content: Document[];
  filteredContent: Document[];
  handleDocumentPress: (doc: Document) => void;
  handleDocumentActionsModal: (doc: Document) => void;
}

const DocumentsDisplay: FC<DocumentsDisplayProps> = ({
  content,
  filteredContent,
  handleDocumentActionsModal,
  handleDocumentPress,
}) => {
  return (
    <StyledView className="w-full px-5 py-2">
      {filteredContent.length === 0 && content.length > 0 && (
        <Text
          text="Last modification"
          type="caption"
          className="text-zinc-500"
        />
      )}
      <StyledView className="px-1">
        {content && filteredContent.length === 0
          ? content.map((doc: Document) => (
              <Fragment key={doc.name}>
                <DocumentItem
                  document={doc}
                  onPress={() => {
                    handleDocumentPress(doc);
                  }}
                  handleItem={() => handleDocumentActionsModal(doc)}
                />
              </Fragment>
            ))
          : filteredContent.map((doc: Document) => (
              <Fragment key={doc.name}>
                <DocumentItem
                  document={doc}
                  onPress={() => {
                    handleDocumentPress(doc);
                  }}
                  handleItem={() => handleDocumentActionsModal(doc)}
                />
              </Fragment>
            ))}
      </StyledView>
    </StyledView>
  );
};

export default DocumentsDisplay;
