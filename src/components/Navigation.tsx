import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * ナビゲーションリンクの定義
 */
interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/calendar", label: "カレンダー", icon: "📅" },
  { href: "/training-menus", label: "メニュー一覧", icon: "📋" },
  { href: "/training-menus/new", label: "メニュー作成", icon: "➕" },
  { href: "/body-composition", label: "体組成一覧", icon: "📊" },
  { href: "/body-composition/new", label: "体組成登録", icon: "⚖️" },
];

interface NavigationProps {
  /** スマホメニュー展開時のクリックハンドラ（メニューを閉じる用） */
  onLinkClick?: () => void;
}

/**
 * ナビゲーションリンクリストコンポーネント。
 * 現在のページに応じてアクティブ状態を表示する。
 */
export const Navigation: React.FC<NavigationProps> = ({ onLinkClick }) => {
  const router = useRouter();

  return (
    <nav className="app-nav">
      <ul className="app-nav-list">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <li key={item.href} className="app-nav-item">
              <Link
                href={item.href}
                className={`app-nav-link ${isActive ? "active" : ""}`}
                onClick={onLinkClick}
              >
                <span className="app-nav-icon">{item.icon}</span>
                <span className="app-nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
