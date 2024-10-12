/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "http", // Allow images from localhost
        hostname: "localhost",
        port: "8080", // Ensure this matches the port your local server uses
        pathname: "/uploads/properties/**", // Adjust the path to match your image path
      },
    ],
  },
};

export default nextConfig;
