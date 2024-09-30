"use client";

import React from "react";
import { useRouter } from "next/navigation";

const LoginActions = () => {
  const router = useRouter();

  const handleRegisterClick = (event) => {
    event.preventDefault();
    router.replace("/auth/register");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="border-t border-gray-300 w-1/3" />
        <span className="text-sm text-gray-500">Or continue with</span>
        <span className="border-t border-gray-300 w-1/3" />
      </div>
      <div>
        <button
          type="button"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 1.9a6.09 6.09 0 016.09 6.09 6.09 6.09 0 01-6.09 6.09 6.09 6.09 0 01-6.09-6.09A6.09 6.09 0 0112 5.9zm0 1.2A4.89 4.89 0 007.11 12 4.89 4.89 0 0012 16.89 4.89 4.89 0 0016.89 12 4.89 4.89 0 0012 7.1zm0 1.2a3.69 3.69 0 013.69 3.69 3.69 3.69 0 01-3.69 3.69 3.69 3.69 0 01-3.69-3.69A3.69 3.69 0 0112 8.3z" />
          </svg>
          Sign in with Google
        </button>
      </div>
      <div className="text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <a
          href="#"
          className="font-medium text-primary-500 hover:text-primary-400"
          onClick={handleRegisterClick}
        >
          Register here
        </a>
      </div>
    </>
  );
};

export default LoginActions;
