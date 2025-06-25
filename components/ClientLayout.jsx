"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "./Navigation/Navbar";
import MobileNavbar from "./Navigation/MobileNavbar";
import { SnackbarProvider } from "notistack";
import NotificationListener from "./Notification/NotificationListener";

const Analytics = dynamic(() => import("@/components/Analytics"), {
  ssr: false,
});

const ClientLayout = ({ children }) => {
  const hideRoutes = ["/auth/login", "/auth/register", "auth/otp"];
  const pathname = usePathname();
  return (
    <AuthProvider>
      <SnackbarProvider
        maxSnack={3}
        classes={{
          variantSuccess: "bg-green-500 text-white",
          variantError: "bg-red-500 text-white",
          variantWarning: "bg-yellow-500 text-white",
          variantInfo: "bg-blue-500 text-white",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{
          borderRadius: "16px",
          maxWidth: "100%",
          margin: "30 auto",
          bottom: "80px",
        }}
      >
        <Analytics />
        {!hideRoutes.includes(pathname) && <Navbar />}
        <main className="flex-1">{children}</main>
        {!hideRoutes.includes(pathname) && <MobileNavbar />}
        {!hideRoutes.includes(pathname) && <Footer className="mt-auto" />}
        <NotificationListener />
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
