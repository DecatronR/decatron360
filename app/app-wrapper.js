import { AppProps } from "next/app";
import ReactGA from "react-ga";

// Initialize Google Analytics
ReactGA.initialize("G-SPP14R22ER");

function AppWrapper({ Component, pageProps }) {
  // Log page views
  ReactGA.pageview(window.location.pathname);

  return <Component {...pageProps} />;
}

export default AppWrapper;
