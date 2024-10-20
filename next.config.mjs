import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
import withTM from "next-transpile-modules";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define an array of modules to transpile
const transpileModules = ["mime-types", "mime-db", "form-data", "axios"];

const nextConfig = withTM(transpileModules)({
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
        protocol: "http",
        hostname: "localhost",
        port: "1280",
        pathname: "/uploads/properties/**",
      },
    ],
  },
  webpack: (config) => {
    // Keep the existing JSON loader
    config.module.rules.push({
      test: /\.json$/,
      type: "javascript/auto",
      loader: "json-loader",
    });

    // CSS Loader for FullCalendar and other third-party packages
    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              auto: true, // Enable CSS modules automatically for .module.css files
            },
          },
        },
        "postcss-loader",
      ],
      include: [
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "assets/styles"),
      ],
    });

    // Aliases setup
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    return config;
  },
});

export default nextConfig;
