import { useState, FC } from "react";
import { View, StatusBar } from "react-native";
import { styled } from "nativewind";

import { useTheme } from "context/ThemeContext";

import Navigation from "@components/layout/Navigation";
import Header from "@components/layout/Header";
import Documents from "./Documents/Home";
import Alarms from "./Alarms/Home";

const StyledView = styled(View);

interface HomeProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

const Home: FC<HomeProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const [navigationIndex, setNavigationIndex] = useState(0);

  return (
    <>
      <StatusBar
        showHideTransition="slide"
        backgroundColor={theme === "dark" ? "#09090b" : "#FFFFFF"}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <StyledView className="flex-1 flex-col justify-between items-center relative bg-white dark:bg-zinc-950">
        <Header navigation={navigation} />

        <StyledView className="flex-1 w-full">
          {navigationIndex === 0 && <Documents />}
          {navigationIndex === 1 && <Alarms />}
        </StyledView>

        <Navigation
          activeIndex={navigationIndex}
          onSelect={setNavigationIndex}
          items={[
            {
              name: "Documents",
              icon: "File",
              color: "#46B1C9",
            },
            { name: "Alarms", icon: "Bell", color: "#46B1C9" },
          ]}
        />
      </StyledView>
    </>
  );
};

export default Home;
