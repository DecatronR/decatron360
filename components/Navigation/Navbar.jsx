import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import profileDefault from "@/assets/images/profile.png";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HousePlus, Search, FilePlus2, LayoutList, X } from "lucide-react";
import PropertySearchForm from "../Properties/PropertySearchForm";
import NotificationBell from "../Notification/NotificationBell";
import ActionMenu from "../ui/ActionMenu";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const profileImage = user?.image;
  const userId = user?.id;
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNavbar, setShowSearchInNavbar] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const shouldShowSearch = pathname === "/" && showSearchInNavbar;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (scrollY > 400) {
        setShowSearchInNavbar(true);
      } else {
        setShowSearchInNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    router.replace("/auth/login");
  };

  const handleRequestProperty = () => {
    router.push("/property-requests/create");
  };

  const handleViewAllRequests = () => {
    const userId =
      typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
    if (!userId) {
      router.push("/auth/login?redirect=/property-requests");
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

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Link className="flex flex-shrink-0 items-center md:block" href="/">
              <Image className="h-7 w-auto" src={logo} alt="Decatron360" />
            </Link>
            {/* Desktop Search Bar: perfectly centered, wide, only on md+ */}
            {shouldShowSearch && !showMobileSearch && (
              <div className="hidden md:flex absolute left-0 right-0 mx-auto justify-center items-center max-w-md lg:max-w-lg w-full h-full z-10">
                <PropertySearchForm />
              </div>
            )}
          </div>
          {/* Mobile right-side controls: search, notification, profile */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Search Icon and Bar */}
            {shouldShowSearch && (
              <>
                {!showMobileSearch && (
                  <button
                    className="flex items-center justify-center p-2 text-primary-500 hover:bg-primary-50 rounded-full"
                    aria-label="Open search"
                    onClick={() => setShowMobileSearch(true)}
                  >
                    <Search size={22} />
                  </button>
                )}
                {showMobileSearch && (
                  <div className="flex items-center w-full absolute left-0 right-0 top-0 bg-white z-50 px-4 py-2 gap-2">
                    <PropertySearchForm />
                    <button
                      className="ml-2 p-2 text-primary-500 hover:bg-primary-50 rounded-full"
                      aria-label="Close search"
                      onClick={() => setShowMobileSearch(false)}
                    >
                      <X size={22} />
                    </button>
                  </div>
                )}
              </>
            )}
            {/* Notification Icon */}
            {user && (
              <NotificationBell color="text-primary-500" iconSize="h-5 w-5" />
            )}
            {/* Profile Menu */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsMobileProfileMenuOpen((prev) => !prev)}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full border-2 border-primary-500 bg-white"
                    src={user?.passport || profileDefault}
                    alt="User Profile"
                    width={32}
                    height={32}
                  />
                </button>
                {isMobileProfileMenuOpen && (
                  <div
                    className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    {/* User Information */}
                    <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-100">
                      <div className="flex items-center space-x-3 ">
                        <Link
                          href="/user-profile"
                          className="flex items-center space-x-3 "
                          role="menuitem"
                          tabIndex="-1"
                          onClick={() => setIsMobileProfileMenuOpen(false)}
                        >
                          <Image
                            className="h-10 w-10 rounded-full border-2 border-primary-500 bg-white"
                            src={user?.passport || profileDefault}
                            alt="User Profile"
                            width={32}
                            height={32}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name || "User Name"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.role?.charAt(0).toUpperCase() +
                                user?.role?.slice(1) || "Role"}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileProfileMenuOpen(false);
                        signOut();
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Right side menu (Login button when not authenticated) */}
          {!user && (
            <div className="hidden md:block md:ml-6">
              <div className="flex items-center space-x-4">
                <ActionMenu
                  items={requestMenuItems}
                  trigger={
                    <button className="flex items-center gap-2 text-white bg-primary-500 hover:bg-primary-600 rounded-full px-4 py-2 transition">
                      <FilePlus2 size={18} className="inline-block" />
                      <span>Request Property</span>
                    </button>
                  }
                />
                <button
                  onClick={handleLogin}
                  className="flex items-center text-[#08253f] bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition"
                >
                  <span>Login</span>
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="flex items-center text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-4 py-2 transition"
                >
                  <span>Sign up</span>
                </button>
              </div>
            </div>
          )}
          {/* Right side menu (Profile and logout when authenticated) */}
          {user && (
            <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              {/* Conditional CTA Button */}
              {user.role === "buyer" ? (
                <ActionMenu
                  items={requestMenuItems}
                  trigger={
                    <button className="hidden sm:flex items-center gap-2 text-white bg-primary-500 hover:bg-primary-600 rounded-full px-4 py-2 transition shadow-lg transform hover:scale-105 mr-4">
                      <FilePlus2 size={18} className="inline-block" />
                      <span className="hidden sm:inline">Request Property</span>
                    </button>
                  }
                />
              ) : ["owner", "agent", "property-manager", "caretaker"].includes(
                  user.role
                ) ? (
                <button
                  onClick={() => router.push("/properties/add/for-rent")}
                  className="hidden sm:flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 transition shadow-lg transform hover:scale-105 mr-4"
                >
                  <HousePlus size={18} className="inline-block" />
                  <span className="hidden sm:inline">Add Property</span>
                </button>
              ) : null}
              {/* Notification Bell */}
              <div className="mr-4">
                <NotificationBell color="text-primary-500" iconSize="h-5 w-5" />
              </div>
              <div className="relative ml-3">
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full border-2 border-primary-500 bg-white"
                    src={user?.passport || profileDefault}
                    alt="User Profile"
                    width={32}
                    height={32}
                  />
                </button>
                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    {/* User Information */}
                    <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-100">
                      <div className="flex items-center space-x-3 ">
                        <Link
                          href="/user-profile"
                          className="flex items-center space-x-3 "
                          role="menuitem"
                          tabIndex="-1"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Image
                            className="h-10 w-10 rounded-full border-2 border-primary-500 bg-white"
                            src={user?.passport || profileDefault}
                            alt="User Profile"
                            width={32}
                            height={32}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name || "User Name"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.role?.charAt(0).toUpperCase() +
                                user?.role?.slice(1) || "Role"}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/* Dropdown Menu Items */}
                    {(user.role === "buyer" ||
                      user.role === "agent" ||
                      user.role === "admin") && (
                      <Link
                        href="/properties/favorite"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Favourite Properties
                      </Link>
                    )}
                    <Link
                      href={`/agent-scheduler/${user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Availability
                    </Link>
                    <Link
                      href={`/my-inspections/${user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      My Inspections
                    </Link>
                    {[
                      "owner",
                      "property-manager",
                      "caretaker",
                      "buyer",
                    ].includes(user.role) && (
                      <Link
                        href={
                          ["owner", "property-manager", "caretaker"].includes(
                            user.role
                          )
                            ? "/owner-contracts"
                            : "/client-contracts"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Contracts
                      </Link>
                    )}

                    {[
                      "owner",
                      "property-manager",
                      "caretaker",
                      "agent",
                    ].includes(user.role) && (
                      <Link
                        href={
                          ["owner", "property-manager", "caretaker"].includes(
                            user.role
                          )
                            ? "/owner-network-map"
                            : "/agent-network-map"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Network Map
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
