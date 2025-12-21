import "@/styles/globals.css";
import "@/styles/layout.css";
import "@/styles/calendar.css";
import "@/styles/body-composition.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
