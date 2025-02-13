import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";
import profileDefault from "@/assets/images/profile.png";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const profileImage = user?.image;
  const userId = user?.id;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogin = () => {
    router.replace("/auth/login");
  };

  return (
    <nav className="bg-primary-500 border-b border-primary-600 shadow-lg z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Logo and navigation links */}
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image className="h-7 w-auto" src={logo} alt="Decatron360" />
            </Link>
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className={`${
                    pathname === "/" ? "bg-primary-600" : ""
                  } text-white hover:bg-primary-600 hover:text-white rounded-md px-3 py-2 transition`}
                >
                  Home
                </Link>
                <Link
                  href="/properties"
                  className={`${
                    pathname === "/properties" ? "bg-primary-600" : ""
                  } text-white hover:bg-primary-600 hover:text-white rounded-md px-3 py-2 transition`}
                >
                  Properties
                </Link>
              </div>
            </div>
          </div>

          {/* Right side menu (Login button when not authenticated) */}
          {!user && (
            <div className="hidden md:block md:ml-6">
              <div className="flex space-x-4">
                <button
                  onClick={handleLogin}
                  className="flex items-center text-white bg-gray-700 hover:bg-gray-800 rounded-md px-4 py-2 transition"
                >
                  <span>Login</span>
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="flex items-center text-gray-700 bg-gray-200 hover:bg-white rounded-md px-4 py-2 transition"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          )}

          {/* Right side menu (Profile and logout when authenticated) */}
          {user && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              {/* Add Property Button */}
              <button
                onClick={() => router.push("/properties/select-listing-type")}
                className="hidden md:flex items-center text-white bg-green-600 hover:bg-green-700 rounded-md px-4 py-2 transition shadow-lg transform hover:scale-105 mr-4"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Property
              </button>

              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition"
                >
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
              </Link>
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
                    <Link
                      href="/properties/favorite"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Favourite Properties
                    </Link>
                    <Link
                      href={`/agent-scheduler/${user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Scheduler
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
                    <Link
                      //add uniqueness with id for each user
                      href={`/network-map`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Network Map
                    </Link>{" "}
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "bg-primary-600" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium transition`}
            >
              Home
            </Link>
            <Link
              href="/properties"
              className={`${
                pathname === "/properties" ? "bg-primary-600" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium transition`}
            >
              Properties
            </Link>
            {user && (
              <button
                onClick={() => router.push("/properties/select-listing-type")}
                className="flex items-center justify-center w-full rounded-md bg-green-600 text-white px-4 py-2 text-base font-medium hover:bg-green-700 transition shadow-lg transform hover:scale-105"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Property
              </button>
            )}
            {!user && (
              <div className="space-y-1 px-2 pb-3 pt-2">
                <button
                  onClick={handleLogin}
                  className="block w-full text-white bg-gray-700 hover:bg-gray-800 rounded-md px-4 py-2 text-base font-medium transition"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="block w-full text-gray-700 bg-gray-200 hover:bg-white rounded-md px-4 py-2 text-base font-medium transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
