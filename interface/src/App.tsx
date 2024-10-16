import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider } from "context/ThemeContext";
import { AuthProvider } from "context/AuthContext";
import { ProfileProvider } from "context/ProfileContext";
import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "@components/ui/Toast";

import queryClient from "services/queryClient";

import AdlamFont from "@fonts/ADLaMDisplay-Regular.ttf";

const App = () => {
  const [fontsLoaded] = useFonts({
    ADLaMDisplay: AdlamFont,
  });

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <ThemeProvider>
            <AppNavigator />
            <Toast />
          </ThemeProvider>
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default registerRootComponent(App);
