"use client";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SnackbarProvider } from "notistack";

const Analytics = dynamic(() => import("@/components/Analytics"), {
  ssr: false,
});

export default function ClientLayout({ children }) {
  return (
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
        <Analytics />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer className="mt-auto" />
      </SnackbarProvider>
    </AuthProvider>
  );
}
