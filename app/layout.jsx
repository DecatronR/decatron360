"use client";
import "@/assets/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SnackbarProvider } from "notistack";
import "photoswipe/dist/photoswipe.css";

const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SnackbarProvider
            maxSnack={3}
            classes={{
              variantSuccess: "bg-green-500 text-white",
              variantError: "bg-red-500 text-white",
              variantWarning: "bg-yellow-500 text-black",
              variantInfo: "bg-blue-500 text-white",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SnackbarProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default MainLayout;
