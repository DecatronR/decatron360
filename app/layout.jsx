"use client";

import { useState } from "react";
import "@/assets/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { GlobalProvider } from "@/context/GlobalContext";
import "photoswipe/dist/photoswipe.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appMetadata } from "./appMetadata";
import Dialog from "@/ui/Dialog";
import AuthenticationForms from "@/components/authenticationForms";
import LoginForm from "@/components/authenticationForms/LoginForm";
import RegistrationForm from "@/components/authenticationForms/RegistrationForm";
import axios from "axios";

const MainLayout = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleOpenLogin = () => {
    console.log("open login dialog triggered");
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <Navbar onOpenLogin={handleOpenLogin} />
            <main>{children}</main>
            <AuthenticationForms
              isLoginOpen={isLoginOpen}
              onOpenLogin={handleOpenLogin}
              onCloseLogin={handleCloseLogin}
            />
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
};

export default MainLayout;
