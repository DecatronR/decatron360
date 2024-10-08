import { createContext, useContext, useState, useEffect } from "react";
import { signInApi } from "@/utils/api/auth/signInApi";
import { signOutApi } from "@/utils/api/auth/signOutApi";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email, password) => {
    try {
      const { userId, token } = await signInApi(email, password);
      document.cookie = `auth_jwt=${token}; path=/`;

      sessionStorage.setItem("userId", userId);

      const res = await axios.post(
        "http://localhost:8080/users/editUsers",
        { id: userId },
        { withCredentials: true }
      );
      const user = res.data.data;
      setUser(user);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const signOut = async () => {
    try {
      await signOutApi();
      sessionStorage.removeItem("userId");
      setUser(null);
    } catch (error) {
      console.error("Sign out failed", error);
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
