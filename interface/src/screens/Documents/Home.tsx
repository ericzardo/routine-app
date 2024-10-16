import { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Pressable,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { styled } from "nativewind";

import { useProfile } from "context/ProfileContext";

import Icon from "@components/common/Icon";
import SearchInput from "@components/forms/SearchInput";

import FolderBreadcrumb from "@components/documents/FolderBreadcrumb";
import SearchStatus from "@components/documents/SearchStatus";
import DocumentsDisplay from "@components/documents/DocumentsDisplay";

import AddDocument from "./modals/Add";

import DocumentActions from "./modals/Actions";

import { Document } from "types/user";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

const Documents = () => {
  const { profile } = useProfile();

  const [documents, setDocuments] = useState<Document[]>([]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  const [currentPath, setCurrentPath] = useState<Document[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDocuments(profile?.documents || []);
  }, [profile]);

  useEffect(() => {
    setCurrentPath([]);
  }, [documents]);

  const [isDocumentActionsModalOpen, setIsDocumentsActionsModalOpen] =
    useState<boolean>(false);
  const [isDocumentAddModalOpen, setIsDocumentAddModalOpen] =
    useState<boolean>(false);

  const handleGoBack = useCallback(() => {
    setCurrentPath(prevPath => prevPath.slice(0, -1));
  }, []);

  const handleDocumentActionsModal = useCallback((document?: Document) => {
    setSelectedDocument(document || null);
    setIsDocumentsActionsModalOpen(prev => !prev);
  }, []);

  const handleDocumentAddModal = useCallback(() => {
    setIsDocumentAddModalOpen(prev => !prev);
  }, []);

  useEffect(() => {
    if (profile?.documents) {
      setDocuments(profile.documents);
    }
  }, [profile]);

  useEffect(() => {
    setCurrentPath([]);
  }, [documents]);

  const handleSearch = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setSearch(event.nativeEvent.text);
    },
    [],
  );

  const searchInDocuments = useCallback(
    (docs: Document[], query: string): Document[] => {
      let results: Document[] = [];

      docs.forEach(doc => {
        if (doc.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(doc);
        }

        if (doc.type.toLowerCase() === "folder" && doc.content) {
          results = results.concat(searchInDocuments(doc.content, query));
        }
      });

      return results;
    },
    [],
  );

  const handleDocumentPress = useCallback(
    (document: Document) => {
      setSelectedDocument(document);

      if (document.type.toLowerCase() === "folder" && document.content) {
        const isLastDocument =
          currentPath.length > 0 &&
          currentPath[currentPath.length - 1].id === document.id;

        if (isLastDocument) return;

        setCurrentPath(prevPath => [...prevPath, document]);
      }
    },
    [currentPath],
  );

  const currentContent = useMemo(() => {
    return currentPath.length > 0
      ? currentPath[currentPath.length - 1].content || []
      : documents;
  }, [currentPath, documents]);

  const filteredContent = useMemo<Document[] | []>(
    () =>
      search.length > 0 ? searchInDocuments(documents, search) : currentContent,
    [search, documents, currentContent, searchInDocuments],
  );

  return (
    <>
      <StyledView className="w-full px-5 py-2">
        <SearchInput
          placeholder="Search in Documents"
          onChange={handleSearch}
        />
      </StyledView>
      <StyledView className="w-full h-1 bg-warmSand dark:bg-obsidianVeil"></StyledView>

      <StyledView className="w-full py-2 px-2 flex-row">
        {currentPath.length > 0 && search.length === 0 ? (
          <FolderBreadcrumb path={currentPath} onGoBack={handleGoBack} />
        ) : (
          search.length > 0 && <SearchStatus search={search} />
        )}
      </StyledView>

      <DocumentsDisplay
        content={currentContent}
        filteredContent={filteredContent}
        handleDocumentActionsModal={handleDocumentActionsModal}
        handleDocumentPress={handleDocumentPress}
      />

      <StyledPressable
        onPress={handleDocumentAddModal}
        className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-zinc-50 dark:bg-zinc-950 shadow shadow-zinc-950 dark:shadow-zinc-50/10 items-center justify-center">
        <Icon name="Plus" color="#46B1C9" size={40} />
      </StyledPressable>

      {isDocumentAddModalOpen && (
        <AddDocument path={currentPath} onClose={handleDocumentAddModal} />
      )}

      {isDocumentActionsModalOpen && selectedDocument && (
        <DocumentActions
          document={selectedDocument}
          onClose={handleDocumentActionsModal}
        />
      )}
    </>
  );
};

export default Documents;
