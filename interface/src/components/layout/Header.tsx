import { useCallback, useState, FC } from "react";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";

import { useTheme } from "context/ThemeContext";
import { useProfile } from "context/ProfileContext";
import { useAuth } from "context/AuthContext";

import Modal from "@components/ui/Modal";
import Icon from "@components/common/Icon";
import Text from "@components/common/Text";
import IconLabel from "@components/common/IconLabel";

import HeaderProfiles from "../modals/Profiles";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface HeaderProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

const Header: FC<HeaderProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfilesOpen, setIsProfilesOpen] = useState<boolean>(false);

  const handleMenuModal = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleProfilesModal = useCallback(() => {
    setIsProfilesOpen(prev => !prev);
  }, []);

  return (
    <StyledView className="w-full px-4 pt-2 flex-row items-center justify-between">
      <StyledPressable
        onPress={handleProfilesModal}
        className="flex-1 flex-row justify-center items-center pl-10">
        <Text
          text={profile ? profile.name : "Add Profile"}
          type="small"
          className="text-zinc-700 dark:text-zinc-200"
        />
        <StyledView className="w-2" />
        <Icon
          size={18}
          name="ChevronDown"
          color={theme === "dark" ? "#e4e4e7" : "#3f3f46"}
        />
      </StyledPressable>

      <StyledPressable className="pl-5" onPress={handleMenuModal}>
        <Icon
          size={24}
          name="Menu"
          color={theme === "dark" ? "#e4e4e7" : "#3f3f46"}
        />
      </StyledPressable>

      {isMenuOpen && (
        <Modal onClose={handleMenuModal} title="">
          <IconLabel icon="Settings" label="Settings" />
          <IconLabel icon="ShieldCheck" label="Security" />
          <IconLabel
            icon="SunMoon"
            label="Toggle Theme"
            onPress={toggleTheme}
          />
          <IconLabel
            icon="LogOut"
            label="Logout"
            onPress={() => {
              logout();
              navigation.navigate("Welcome");
            }}
          />
        </Modal>
      )}

      {isProfilesOpen && <HeaderProfiles onClose={handleProfilesModal} />}
    </StyledView>
  );
};

export default Header;
