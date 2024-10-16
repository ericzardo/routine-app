import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "app_theme";

export const storeTheme = async (theme: string) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Error storing the theme:", error);
  }
};

export const getTheme = async (): Promise<string | null> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme;
  } catch (error) {
    console.error("Error retrieving the theme:", error);
    return null;
  }
};

export const removeTheme = async () => {
  try {
    await AsyncStorage.removeItem(THEME_KEY);
  } catch (error) {
    console.error("Error removing the theme:", error);
  }
};
