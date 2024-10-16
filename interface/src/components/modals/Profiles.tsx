import { useCallback, useState, FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Pressable } from "react-native";
import { styled } from "nativewind";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "context/AuthContext";
import { useProfile } from "context/ProfileContext";
import { getProfiles, addProfile } from "services/http/profiles";

import Text from "@components/common/Text";
import Icon from "@components/common/Icon";
import LabeledInput from "@components/forms/LabeledInput";
import Modal from "@components/ui/Modal";
import Toast from "react-native-toast-message";

import { Profile } from "types/user";

const StyledPressable = styled(Pressable);

const ProfileFormData = z.object({
  name: z.string().min(3).max(24),
});

type ProfileSchema = z.infer<typeof ProfileFormData>;

interface HeaderProfilesProps {
  onClose: () => void;
}

const HeaderProfiles: FC<HeaderProfilesProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { profile: selectedProfile, setProfile } = useProfile();

  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] =
    useState<boolean>(false);

  const handleCreateProfileModal = useCallback(() => {
    setIsCreateProfileModalOpen(prev => !prev);
  }, []);

  const handleAddProfile = useCallback(
    async (data: ProfileSchema) => {
      const response = await addProfile(data);

      handleCreateProfileModal();

      Toast.show({
        type: "success",
        text1: response?.message || "Profile created successfully!",
      });
    },
    [handleCreateProfileModal],
  );

  const { data: profiles } = useQuery<Profile[] | []>({
    queryKey: ["userProfiles"],
    queryFn: async () => {
      const data = await getProfiles();

      return data?.profiles || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(ProfileFormData),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Modal onClose={onClose} title="">
      {profiles &&
        profiles.length > 0 &&
        profiles.map((profile: Profile) => (
          <StyledPressable
            key={profile.name}
            onPress={() => setProfile(profile)}
            className="w-full flex-row items-center justify-between mb-2">
            <Text
              text={profile.name}
              type="large"
              className="text-zinc-700 dark:text-zinc-300 ml-2"
            />

            {selectedProfile?.id === profile.id && (
              <Icon name="Check" size={24} color="#46B1C9" />
            )}
          </StyledPressable>
        ))}

      <StyledPressable
        onPress={handleCreateProfileModal}
        className="w-full flex-row items-center justify-between mb-2">
        <Text
          text="Create a Profile"
          type="large"
          className="text-zinc-700 dark:text-zinc-300 ml-2"
        />
      </StyledPressable>

      {isCreateProfileModalOpen && (
        <Modal
          title="Profile"
          onSave={handleSubmit(handleAddProfile)}
          onClose={onClose}
          withHeader="save">
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <LabeledInput
                label="Name"
                placeholder="Type profile name"
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
            name="name"
          />
        </Modal>
      )}
    </Modal>
  );
};

export default HeaderProfiles;
