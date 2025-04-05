import "@/assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Decatron",
  description: "Real estate transactions like online shopping",
  keywords:
    "properties, real estate, houses, homes, apartments, rent, buy, sell, shortlet, lease, shop real estate, abuja",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/nasalization"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/raleway-5"
          rel="stylesheet"
        />

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

        {/* Tawk.to chat widget script */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/67f0e7199eb96f190c92a718/1io2gdfkl';  
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
