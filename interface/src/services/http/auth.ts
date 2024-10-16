import { z } from "zod";
import Toast from "react-native-toast-message";

import api from "services/api";
import queryClient from "services/queryClient";
import { removeToken } from "services/storage/auth";

import handleError from "./handleError";

import { User } from "types/user";

const createAccountSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Username must have a maximum of 20 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must have a maximum of 24 characters" }),
});
const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must have a maximum of 24 characters" }),
});

type CreateAccountData = z.infer<typeof createAccountSchema>;
type SignInData = z.infer<typeof SignInSchema>;

export const createAccount = async (data: CreateAccountData) => {
  try {
    createAccountSchema.parse(data);

    const response = await api.post<{
      user: User;
      token: string;
      message: string;
    }>("/users", data);

    if (!response.data?.user) {
      throw new Error("Failed creating account");
    }

    if (!response.data?.token) {
      throw new Error("Failed authentication new account");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: "Account created successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const signIn = async (
  data: SignInData,
  login: (token: string) => void,
) => {
  try {
    SignInSchema.parse(data);

    const response = await api.post<{ token: string; message: string }>(
      `/auth/login`,
      data,
    );

    if (!response.data?.token) {
      throw new Error("Failed connecting to account");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });
    login(response.data.token);

    Toast.show({
      type: "success",
      text1: "You have been successfully authenticated!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const authenticated = async () => {
  try {
    const response = await api.get<{ user: User }>("/auth");

    if (!response.data?.user) {
      return null;
    }

    return response.data.user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const Logout = async () => {
  try {
    const response = await api.post("/auth/logout");

    console.log(response);

    await removeToken();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};
