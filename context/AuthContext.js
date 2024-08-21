import { createContext, useContext, useState, useEffect } from 'react';
import { signInApi } from '@/utils/signInApi';
import { signOutApi } from '@/utils/signOutApi';
import { userDataApi } from '@/utils/getUserDataApi';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (userId) {
        try {
          const userData = await userDataApi(userId);
          setUser(userData);
        } catch (error) {
          console.error('Get user failed', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getUserData();
  }, [userId]);

  const signIn = async (email, password) => {
    try {
      const userId = await signInApi(email, password);
      sessionStorage.setItem('userId', userId);
      setUserId(userId);
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  const signOut = async () => {
    try {
      await signOutApi();
      sessionStorage.removeItem('userId');
      setUser(null);
      setUserId(null);
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userId, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};