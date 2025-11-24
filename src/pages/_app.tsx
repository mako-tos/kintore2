import "@/styles/globals.css";
import "@/styles/layout.css";
import "@/styles/calendar.css"; // カレンダー用グローバルスタイル（ページ内インポート不可のためここに集約）
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
