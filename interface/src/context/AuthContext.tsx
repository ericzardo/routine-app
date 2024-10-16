import {
  createContext,
  useCallback,
  FC,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { getToken, storeToken, removeToken } from "services/storage/auth";
import { authenticated, Logout } from "services/http/auth";

import { User } from "types/user";

interface AuthContextData {
  user: User | null;
  revalidateUser: () => Promise<void>;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await getToken();

        if (!storedToken) {
          await removeToken();
          return;
        }

        setToken(storedToken);
      } catch (error) {
        await removeToken();
        console.log("Error loading token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const {
    data: user,
    refetch,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authenticated,
    enabled: !!token,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const revalidateUser = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      await removeToken();
      console.log("Auth Error: ", error);
    }
  }, [refetch]);

  const login = useCallback(
    async (token: string) => {
      try {
        await storeToken(token);
        setToken(token);
        await revalidateUser();
      } catch (error) {
        console.log("Login Error: ", error);
      }
    },
    [revalidateUser],
  );

  const logout = useCallback(async () => {
    try {
      await Logout();
      setToken(null);
    } catch (error) {
      console.log("Logout Error: ", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ? user : null,
        revalidateUser,
        isLoading: isLoading || isUserLoading,
        login,
        logout,
      }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
