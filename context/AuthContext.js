import { createContext, useContext, useState, useEffect } from 'react';
import { signInApi } from '@/utils/signInApi';
import { signOutApi } from '@/utils/signOutApi';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    try {
      const userData = await signInApi(email, password);
      sessionStorage.setItem('userKey', userData.key);
      setUser(userData);  
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  const signOut = async () => {
    try {
      await signOutApi();
      sessionStorage.removeItem('userKey');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  useEffect(() => {
    const storedUserKey = sessionStorage.getItem('userKey');
    if (storedUserKey) {
      setUser({ key: storedUserKey }); 
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
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