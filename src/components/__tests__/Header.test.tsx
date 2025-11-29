/* eslint @typescript-eslint/no-explicit-any: off */
import React from "react";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";
import { AuthProvider } from "@/contexts/AuthContext";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
  }),
}));

// Mock Navigation component
jest.mock("../Navigation", () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Mock Navigation</nav>;
  };
});

describe("Header", () => {
  test("ヘッダーとロゴが正しくレンダリングされる", () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    expect(screen.getByText("筋トレ記録")).toBeInTheDocument();
    expect(screen.getByText("💪")).toBeInTheDocument();
  });

  test("PC用ナビゲーションが表示される", () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    const nav = screen.getAllByTestId("navigation");
    expect(nav.length).toBeGreaterThan(0);
  });

  test("ハンバーガーメニューボタンが表示される", () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    const button = screen.getByLabelText("メニュー");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("ハンバーガーメニューアイコンが表示される", () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    expect(screen.getByText("☰")).toBeInTheDocument();
  });
});
