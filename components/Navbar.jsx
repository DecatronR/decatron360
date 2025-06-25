import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";
import profileDefault from "@/assets/images/profile.png";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HousePlus } from "lucide-react";
import PropertySearchForm from "./Properties/PropertySearchForm";
import NotificationBell from "./ui/NotificationBell";

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

  const shouldShowSearch = pathname === "/" && showSearchInNavbar;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (scrollY > 250) {
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

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-primary-500 transition-all duration-300 ${
        isScrolled
          ? "bg-primary-500 bg-opacity-90 backdrop-blur-md"
          : "bg-primary-500"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            {(!isScrolled || window.innerWidth >= 768) && (
              <Link
                className="flex flex-shrink-0 items-center md:block"
                href="/"
              >
                <Image className="h-7 w-auto" src={logo} alt="Decatron360" />
              </Link>
            )}
          </div>
          {shouldShowSearch && (
            <div className="flex-grow flex justify-center sm:max-w-md md:max-w-lg lg:max-w-none">
              <PropertySearchForm />
            </div>
          )}

          {/* Mobile Profile Button (Only shows Sign Out) */}
          {user && (
            <div className="relative ml-3 block md:hidden">
              <div className="absolute -left-12 top-1">
                <NotificationBell />
              </div>{" "}
              {/* Hides on md and larger */}
              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => setIsMobileProfileMenuOpen((prev) => !prev)}
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="h-8 w-8 rounded-full"
                  src={user?.passport || profileDefault}
                  alt="User Profile"
                  width={40}
                  height={40}
                />
              </button>
              {isMobileProfileMenuOpen && (
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
                        onClick={() => setIsMobileProfileMenuOpen(false)}
                      >
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={user?.passport || profileDefault}
                          alt="User Profile"
                          width={40}
                          height={40}
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
          )}

          {/* Right side menu (Login button when not authenticated) */}
          {!user && (
            <div className="hidden md:block md:ml-6">
              <div className="flex space-x-4">
                <button
                  onClick={handleLogin}
                  className="flex items-center text-white bg-gray-700 hover:bg-gray-800 rounded-full px-4 py-2 transition"
                >
                  <span>Login</span>
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="flex items-center text-gray-700 bg-gray-200 hover:bg-white rounded-full px-4 py-2 transition"
                >
                  <span>Sign up</span>
                </button>
              </div>
            </div>
          )}

          {/* Right side menu (Profile and logout when authenticated) */}
          {user && (
            <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              {/* Add Property Button */}
              <button
                onClick={() => router.push("/properties/add/for-rent")}
                className="hidden sm:flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 transition shadow-lg transform hover:scale-105 mr-4"
              >
                <HousePlus size={18} className="inline-block" />
                <span className="hidden sm:inline">Add Property</span>
              </button>
              {/* Notification Bell */}
              <div className="mr-4">
                <NotificationBell />
              </div>
              <div className="relative ml-3">
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={user?.passport || profileDefault}
                    alt="User Profile"
                    width={40}
                    height={40}
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
                            className="h-10 w-10 rounded-full"
                            src={user?.passport || profileDefault}
                            alt="User Profile"
                            width={40}
                            height={40}
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
