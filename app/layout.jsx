import "@/assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";
import Analytics from "components/Analytics";

export const metadata = {
  title: "Decatron",
  description: "Creating a leap in value",
  keywords:
    "properties, real estate, houses, homes, apartments, rent, buy, sell",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SPP14R22ER"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SPP14R22ER');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <Analytics />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
