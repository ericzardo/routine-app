import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { getProfile, storeProfile } from "services/storage/profile";

import { Profile } from "types/user";

interface ProfileContextData {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

const ProfileContext = createContext<ProfileContextData>(
  {} as ProfileContextData,
);

export const ProfileProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await getProfile();

      if (storedProfile && user) {
        const updatedProfile = user.profiles.find(
          p => p.id === storedProfile.id,
        ) as Profile;
        setProfile(updatedProfile);
      } else if (user) {
        const firstProfile = user.profiles[0] as Profile;
        setProfile(firstProfile);
      }
    };

    loadProfile();
  }, [isLoading, user]);

  useEffect(() => {
    const updateProfile = async () => {
      if (!profile) return;
      await storeProfile(profile);
    };

    updateProfile();
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
