"use client"

import { useState } from 'react';
import '@/assets/styles/globals.css';
import AuthProvider from '@/components/AuthProvider';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { GlobalProvider } from '@/context/GlobalContext';
import 'photoswipe/dist/photoswipe.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appMetadata } from './appMetadata';
import Dialog from '@/ui/Dialog';
import LoginForm from '@/components/LoginForm';
import RegistrationForm from '@/components/RegistrationForm';


const MainLayout = ({ children }) => {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenLogin = () => {
    console.log("open login dialog triggered")
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleOpenRegistration = () => {
    setIsRegisterOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegisterOpen(false);
  };

  return (
    <GlobalProvider>
    <AuthProvider>
      <html lang='en'>
        <body>
          <Navbar onOpenLogin={handleOpenLogin} />
          <main>
            {children}
          </main>
          <Dialog
              isOpen={isLoginOpen}
              onClose={handleCloseLogin}
            >
              <LoginForm
                onOpenRegistration={handleOpenRegistration}
                onCloseLogin={handleCloseLogin}
              />
          </Dialog>

          <Dialog
            isOpen={isRegisterOpen}
            onClose={handleCloseRegistration}
          >
            <RegistrationForm 
              onOpenLogin={handleOpenLogin}
              onCloseRegistration={handleCloseRegistration}
            />
          </Dialog>
          <Footer />
          <ToastContainer />
      </body>
      </html>
    </AuthProvider>
  </GlobalProvider>
  );
};

export default MainLayout;
