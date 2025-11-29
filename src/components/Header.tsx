import React, { useState } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import AuthButton from "./AuthButton";

/**
 * アプリケーション共通ヘッダーコンポーネント。
 * アプリ名とナビゲーションメニュー、認証ボタンを表示。
 * レスポンシブ対応: PC では横並び、スマホではハンバーガーメニュー。
 */
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="app-header-container">
        {/* アプリケーション名/ロゴ */}
        <Link href="/" className="app-logo">
          <span className="app-logo-icon">💪</span>
          <span className="app-logo-text">筋トレ記録</span>
        </Link>

        {/* PC 表示用ナビゲーション */}
        <div className="app-nav-desktop">
          <Navigation />
          <AuthButton />
        </div>

        {/* スマホ表示用ハンバーガーメニューボタン */}
        <button
          className="app-hamburger"
          onClick={toggleMenu}
          aria-label="メニュー"
          aria-expanded={isMenuOpen}
        >
          <span className="app-hamburger-icon">☰</span>
        </button>
      </div>

      {/* スマホ表示用ドロワーメニュー */}
      {isMenuOpen && (
        <>
          <div className="app-menu-overlay" onClick={closeMenu} />
          <div className="app-menu-drawer">
            <Navigation onLinkClick={closeMenu} />
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #ddd",
              }}
            >
              <AuthButton />
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
