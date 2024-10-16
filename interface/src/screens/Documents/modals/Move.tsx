import { useState, FC, useCallback } from "react";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "context/ThemeContext";
import { useProfile } from "context/ProfileContext";
import { moveDocument } from "services/http/documents";
import { getProfiles } from "services/http/profiles";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";
import Modal from "@components/ui/Modal";

import { Document, Profile } from "types/user";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface MoveDocumentProps {
  document: Document;
  onClose: () => void;
}

const MoveDocument: FC<MoveDocumentProps> = ({ document, onClose }) => {
  const { theme } = useTheme();
  const { profile } = useProfile();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<Document[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(
    profile,
  );

  const { data: profiles } = useQuery<Profile[] | []>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const data = await getProfiles();

      return data?.profiles || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleDropdown = useCallback(() => {
    setDropdownOpen(prevState => !prevState);
  }, []);

  const handleProfileSelect = useCallback((profile: Profile) => {
    setSelectedProfile(profile);
    setCurrentPath([]);
    setDropdownOpen(false);
  }, []);

  const handleGoBack = useCallback(() => {
    setCurrentPath(prevPath => prevPath.slice(0, -1));
  }, []);

  const handleFolderPress = useCallback((folder: Document) => {
    if (folder.type.toLowerCase() === "folder" && folder.content) {
      setCurrentPath(prevPath => [...prevPath, folder]);
    }
  }, []);

  const handleDestination = useCallback(async () => {
    if (!selectedProfile) return;

    const data = {
      profileId: selectedProfile.id,
      parentId:
        currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null,
    };

    await moveDocument(document.id, data);

    onClose();
  }, [currentPath, document?.id, selectedProfile, onClose]);

  const currentContent = currentPath.length
    ? currentPath[currentPath.length - 1].content || []
    : selectedProfile?.documents;

  return (
    <Modal
      title="Destination"
      onClose={onClose}
      onSave={handleDestination}
      withHeader="save">
      <StyledView className="flex-row items-center justify-between border-b border-transparent mb-5 relative">
        <Text
          text="Select Profile:"
          type="medium"
          className="text-zinc-600 dark:text-zinc-400"
        />
        <StyledView className="w-5" />
        <StyledPressable
          className="flex-1 px-2 flex-row justify-between items-center relative"
          onPress={handleDropdown}>
          <StyledView className="flex-1 flex-row justify-between px-2 border-b border-softSage dark:border-zinc-500">
            <Text
              text={selectedProfile?.name || ""}
              type="medium"
              className="text-zinc-600 dark:text-zinc-500 font-bold text-base"
            />
            <Icon
              size={24}
              name="ChevronDown"
              color={theme === "dark" ? "#71717a" : "#BCC1BA"}
            />

            {isDropdownOpen && (
              <StyledView className="absolute z-50 top-full w-full right-5 bg-zinc-100 dark:bg-zinc-900 rounded-md overflow-hidden">
                {profiles &&
                  profiles.map(profile => (
                    <StyledPressable
                      key={profile.id}
                      onPress={() => handleProfileSelect(profile)}>
                      <StyledView className="py-2 px-4 flex-row items-center justify-between border-b border-softSage  dark:border-obsidianVeil last:border-b-0 bg-zinc-100 dark:bg-zinc-950/20">
                        <Text
                          text={profile.name}
                          type="medium"
                          className={
                            selectedProfile?.name === profile.name
                              ? "text-skyBlue"
                              : "text-zinc-600 dark:text-zinc-400"
                          }
                        />

                        {selectedProfile?.name === profile.name && (
                          <Icon size={18} name="Check" color="#46B1C9" />
                        )}
                      </StyledView>
                    </StyledPressable>
                  ))}
              </StyledView>
            )}
          </StyledView>
        </StyledPressable>
      </StyledView>

      <StyledView className="w-full py-2 flex-row -z-10">
        <Text
          text="Desintation:"
          type="medium"
          className="text-zinc-600 dark:text-zinc-400"
        />
        <StyledView className="w-5" />
        {currentPath.length > 0 ? (
          <Text
            text={currentPath.map(folder => folder.name).join(" / ")}
            type="medium"
            className="text-zinc-600 dark:text-zinc-500"
          />
        ) : (
          <Text
            text="/"
            type="medium"
            className="text-zinc-600 dark:text-zinc-500"
          />
        )}
      </StyledView>
      <StyledPressable onPress={handleGoBack}>
        <StyledView className="w-full flex-row items-center mb-2 mt-4">
          <Icon size={26} name="ChevronLeft" color="#46B1C9" />
          <Text
            text="Back Folder"
            type="large"
            className="text-zinc-500 dark:text-zinc-400"
          />
        </StyledView>
      </StyledPressable>
      <StyledView className="w-full bg-zinc-100 dark:bg-zinc-950/20 rounded-lg -z-10">
        {currentContent &&
          currentContent.map(item => (
            <StyledPressable
              key={item.id}
              onPress={() =>
                item.type.toLowerCase() === "folder"
                  ? handleFolderPress(item)
                  : null
              }>
              <StyledView
                className={`w-full flex-row items-center p-3 rounded-md justify-between 
               ${item.type.toLowerCase() === "file" ? "opacity-60" : "opacity-100"}
            `}>
                <StyledView className="flex-row items-center">
                  {item.type.toLowerCase() === "folder" ? (
                    <Icon size={30} name="Folder" color="#46B1C9" />
                  ) : (
                    <Icon
                      size={30}
                      name="File"
                      color={theme === "dark" ? "#71717a" : "#71717a"}
                    />
                  )}
                  <StyledView className="w-2" />
                  <Text
                    text={item.name}
                    type="medium"
                    className="text-zinc-500 dark:text-zinc-400"
                  />
                </StyledView>
                {item.type === "folder" && (
                  <Icon
                    size={22}
                    name="ChevronRight"
                    color={theme === "dark" ? "#71717a" : "#52525b"}
                  />
                )}
              </StyledView>
            </StyledPressable>
          ))}
      </StyledView>
    </Modal>
  );
};

export default MoveDocument;
