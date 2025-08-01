"use client";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "./Navigation/Navbar";
import MobileNavbar from "./Navigation/MobileNavbar";
import { SnackbarProvider, closeSnackbar } from "notistack";
import NotificationListener from "./Notification/NotificationListener";

import RequestPropertyFloatingBtn from "components/PropertyRequest/RequestPropertyFloatingBtn";
import PropertyRequestAction from "./ui/PropertyRequestAction";
import AddPropertyAction from "./ui/AddPropertyAction";
import { FilePlus2, LayoutList } from "lucide-react";
import { useRef, useEffect, useState, forwardRef } from "react";

const Analytics = dynamic(() => import("@/components/Analytics"), {
  ssr: false,
});

// Custom Snackbar Component with Swipe Support
const CustomSnackbar = forwardRef(({ id, message, variant, ...other }, ref) => {
  const snackbarRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const element = snackbarRef.current;
    if (!element || !isMobile) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
      touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = touchStartX.current - touchEndX.current;
      const deltaY = touchStartY.current - touchEndY.current;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        // Swipe left or right to dismiss
        closeSnackbar(id);
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [id, isMobile]);

  return (
    <div
      ref={(el) => {
        snackbarRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${
        variant === "success"
          ? "bg-primary-500"
          : variant === "error"
          ? "bg-red-500"
          : variant === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500"
      } text-white select-none ${isMobile ? "touch-pan-x" : ""}`}
      style={{
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
        wordBreak: "break-word",
      }}
    >
      <span className="flex-1 pr-2">{message}</span>

      {/* Show dismiss button only on desktop */}
      {!isMobile && (
        <button
          onClick={() => closeSnackbar(id)}
          className="ml-3 text-white hover:text-gray-200 transition-colors duration-200 flex-shrink-0"
          style={{ fontSize: "18px", lineHeight: "1" }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
});

CustomSnackbar.displayName = "CustomSnackbar";

const MainLayout = ({ children }) => {
  const hideRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/otp",
    "/property-requests/register",
    "/property-requests/otp",
    "/property-requests/login",
    "/register",
    "/login",
  ];
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleAddProperty = () => {
    router.push("/properties/add/for-rent");
  };

  const handleRequestProperty = () => {
    router.push("/property-requests/create");
  };

  const handleViewAllRequests = () => {
    const userId =
      typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
    if (!userId) {
      router.push(`/property-requests/login?redirect=/property-requests`);
    } else {
      router.push("/property-requests");
    }
  };

  const requestMenuItems = [
    {
      label: "Create New Request",
      icon: <FilePlus2 size={16} />,
      onClick: handleRequestProperty,
    },
    {
      label: "View All Requests",
      icon: <LayoutList size={16} />,
      onClick: handleViewAllRequests,
    },
  ];

  const renderFloatingButton = () => {
    // Don't show FAB on contract dashboard pages to avoid conflicts with chat trigger
    if (pathname.startsWith("/contract-dashboard")) {
      return null;
    }

    // Show request button for guests OR buyers
    if (!user || user.role === "buyer") {
      return (
        <PropertyRequestAction
          items={requestMenuItems}
          isFloating={true}
          position="bottom-right"
        />
      );
    }

    // Show add button for other privileged users
    if (
      ["owner", "agent", "property-manager", "caretaker"].includes(user.role)
    ) {
      return <AddPropertyAction isFloating={true} />;
    }

    return null;
  };

  return (
    <>
      <Analytics />
      {!hideRoutes.includes(pathname) && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideRoutes.includes(pathname) && renderFloatingButton()}
      {!hideRoutes.includes(pathname) && <MobileNavbar />}
      {!hideRoutes.includes(pathname) && <Footer className="mt-auto" />}
      <NotificationListener />
    </>
  );
};

const ClientLayout = ({ children }) => {
  return (
    <AuthProvider>
      <SnackbarProvider
        maxSnack={3}
        preventDuplicates
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{
          bottom: "80px",
          left: "16px",
          right: "16px",
          maxWidth: "calc(100vw - 32px)",
        }}
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
          warning: CustomSnackbar,
          info: CustomSnackbar,
        }}
      >
        <MainLayout>{children}</MainLayout>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
