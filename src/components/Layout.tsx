import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * アプリケーション共通レイアウトコンポーネント。
 * すべてのページでヘッダーとメインコンテンツエリアを提供する。
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
