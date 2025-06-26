"use client";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "./Navigation/Navbar";
import MobileNavbar from "./Navigation/MobileNavbar";
import { SnackbarProvider } from "notistack";
import NotificationListener from "./Notification/NotificationListener";
import AddPropertyFloatingBtn from "components/ui/AddPropertyFloatingBtn";
import RequestPropertyFloatingBtn from "components/PropertyRequest/RequestPropertyFloatingBtn";
import ActionMenu from "./ui/ActionMenu";
import { FilePlus2, LayoutList } from "lucide-react";

const Analytics = dynamic(() => import("@/components/Analytics"), {
  ssr: false,
});

const MainLayout = ({ children }) => {
  const hideRoutes = ["/auth/login", "/auth/register", "auth/otp"];
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
    if (!user) {
      // Not authenticated: route to login with redirect param
      router.push(`/auth/login?redirect=/property-requests`);
    } else {
      // Authenticated: go directly
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
    // Show request button for guests OR buyers
    if (!user || user.role === "buyer") {
      return (
        <ActionMenu
          items={requestMenuItems}
          trigger={<RequestPropertyFloatingBtn />}
        />
      );
    }

    // Show add button for other privileged users
    if (
      ["owner", "agent", "property-manager", "caretaker"].includes(user.role)
    ) {
      return <AddPropertyFloatingBtn onClick={handleAddProperty} />;
    }

    return null;
  };

  return (
    <>
      <Analytics />
      {!hideRoutes.includes(pathname) && <Navbar />}
      <main className="flex-1">{children}</main>
      {renderFloatingButton()}
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
        <MainLayout>{children}</MainLayout>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
