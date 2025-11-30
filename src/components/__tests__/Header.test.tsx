/* eslint @typescript-eslint/no-explicit-any: off */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Header } from "../Header";

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

jest.mock("../AuthButton", () => {
  return function MockAuthButton() {
    return <button data-testid="auth-button">Mock Auth Button</button>;
  };
});

describe("Header", () => {
  test("ヘッダーとロゴが正しくレンダリングされる", () => {
    render(<Header />);
    expect(screen.getByText("💪")).toBeInTheDocument();
    expect(screen.getByText("筋トレ記録")).toBeInTheDocument();
  });

  test("PC用ナビゲーションが表示される", () => {
    render(<Header />);

    const nav = screen.getAllByTestId("navigation");
    expect(nav.length).toBeGreaterThan(0);
  });

  test("ハンバーガーメニューボタンが表示される", () => {
    render(<Header />);

    const button = screen.getByLabelText("メニュー");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("ハンバーガーメニューアイコンが表示される", () => {
    render(<Header />);

    expect(screen.getByText("☰")).toBeInTheDocument();
  });
});
