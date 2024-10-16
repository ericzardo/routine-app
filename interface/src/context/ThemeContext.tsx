import {
  createContext,
  useContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { View } from "react-native";
import { useColorScheme, styled } from "nativewind";

import { storeTheme, getTheme } from "services/storage/theme";

const StyledView = styled(View);

interface ThemeContextProps {
  theme: "light" | "dark";
  toggleTheme?: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleTheme = useCallback(() => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    storeTheme(newTheme);
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await getTheme();
      if (storedTheme) {
        storeTheme(storedTheme as "light" | "dark");
        setColorScheme(storedTheme as "light" | "dark");
      } else {
        storeTheme("dark");
        setColorScheme("dark");
      }
    };

    loadTheme();
  }, [setColorScheme]);

  return (
    <ThemeContext.Provider
      value={{ theme: colorScheme, toggleTheme: handleTheme }}>
      <StyledView className="flex-1">{children}</StyledView>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ModalProvider");
  }
  return context;
};
