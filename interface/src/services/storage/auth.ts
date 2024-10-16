import AsyncStorage from "@react-native-async-storage/async-storage";

const JWT_TOKEN = "jwt_token";

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(JWT_TOKEN, token);
  } catch (error) {
    console.error("Error storing the token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(JWT_TOKEN);
  } catch (error) {
    console.error("Error retrieving the token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(JWT_TOKEN);
  } catch (error) {
    console.error("Error removing the token:", error);
  }
};
