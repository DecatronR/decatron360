import "@/assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Decatron",
  description: "Creating a leap in value",
  keywords:
    "properties, real estate, houses, homes, apartments, rent, buy, sell",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
