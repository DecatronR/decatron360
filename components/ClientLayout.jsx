"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MobileNavbar from "./MobileNavbar";
import { SnackbarProvider } from "notistack";
import NotificationListener from "./ui/NotificationListener";

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
          horizontal: "right",
        }}
        style={{ borderRadius: "25px" }}
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
