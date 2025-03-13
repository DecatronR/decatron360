import { createContext, useContext, useState, useEffect } from "react";
import { signInApi } from "@/utils/api/auth/signInApi";
import { signOutApi } from "@/utils/api/auth/signOutApi";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email, password) => {
    try {
      const { userId, token } = await signInApi(email, password);

      if (!userId || !token) {
        throw new Error("Invalid login response");
      }

      document.cookie = `auth_jwt=${token}; path=/`;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("token", token);

      const res = await axios.post(
        `${baseUrl}/users/editUsers`,
        { id: userId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data.data;
      setUser(user);
      return user;
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutApi();
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Sign out failed", error);
      throw error;
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const userData = await fetchUserData(userId);
          setUser(userData);
        } catch (error) {
          console.error("Get user failed", error);
          throw error;
        } finally {
          setLoading(false);
        }
      }
    };

    getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
