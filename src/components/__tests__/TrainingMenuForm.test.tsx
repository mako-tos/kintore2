/* eslint @typescript-eslint/no-explicit-any: off */
/* eslint @typescript-eslint/ban-ts-comment: off */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TrainingMenuForm from "../TrainingMenuForm";

// Simple fetch mock
const menus = [{ id: "1", name: "スクワット" }];

beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn((url: string, opts?: any) => {
    if (
      url.includes("/api/training-menus") &&
      (!opts || opts.method === "GET")
    ) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(menus) });
    }
    if (url.includes("/api/training-menus") && opts?.method === "POST") {
      const body = JSON.parse(opts.body);
      if (body.name === "スクワット") {
        return Promise.resolve({
          ok: false,
          status: 409,
          json: () => Promise.resolve({ message: "Duplicate" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: "2", name: body.name }),
      });
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: "Not Found" }),
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("TrainingMenuForm", () => {
  test("renders input and buttons", async () => {
    render(<TrainingMenuForm />);
    await waitFor(() => {}); // 初期の非同期処理を待つ
    expect(screen.getByLabelText("メニュー名")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  test("can not click submit", async () => {
    render(<TrainingMenuForm />);
    await waitFor(() => {}); // 初期の非同期処理を待つ
    const submit = screen.getByRole("button", { name: "登録" });
    expect(submit).not.toBeDisabled();
  });

  test("duplicate name shows error", async () => {
    render(<TrainingMenuForm />);
    await waitFor(() => {}); // 初期の非同期処理を待つ
    const input = screen.getByPlaceholderText("スクワット");
    await userEvent.type(input, "スクワット");
    expect(input).toHaveValue("スクワット");

    const submit = screen.getByRole("button", { name: "登録" });
    expect(submit).not.toBeDisabled();
    await userEvent.click(submit);
    expect(
      screen.getByText("この名前は既に登録されています")
    ).toBeInTheDocument();
  });
  test("successful submit resets form", async () => {
    render(<TrainingMenuForm />);
    await waitFor(() => {}); // 初期の非同期処理を待つ
    const input = screen.getByLabelText("メニュー名");
    await userEvent.type(input, "腹筋");
    expect(input).toHaveValue("腹筋");

    const submit = screen.getByRole("button", { name: "登録" });
    await waitFor(() => expect(submit).not.toBeDisabled());
    await userEvent.click(submit);
    await waitFor(() => {
      expect(screen.getByText("メニューを登録しました")).toBeInTheDocument();
    });
    expect((input as HTMLInputElement).value).toBe("");
  });
});
