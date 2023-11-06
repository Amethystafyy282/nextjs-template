import type { AppProps } from "next/app";
import Layout from "@/components/organisms/layout";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
