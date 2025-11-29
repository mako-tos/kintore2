import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ErrorMessage from "./ErrorMessage";

/**
 * 認証ボタンコンポーネント
 * ログイン/ログアウトボタンとユーザー情報を表示
 */
export const AuthButton: React.FC = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message || "ログインに失敗しました");
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      await signOut();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message || "ログアウトに失敗しました");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <div className="auth-button-loading">読み込み中...</div>;
  }

  if (user) {
    return (
      <div className="auth-button-container">
        <span className="auth-user-email">{user.email}</span>
        <button
          type="button"
          className="pure-button"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "ログアウト中..." : "ログアウト"}
        </button>
        {error && <ErrorMessage errors={[{ field: "auth", message: error }]} />}
      </div>
    );
  }

  return (
    <div className="auth-button-container">
      <button
        type="button"
        className="pure-button pure-button-primary"
        onClick={handleSignIn}
      >
        Google でログイン
      </button>
      {error && <ErrorMessage errors={[{ field: "auth", message: error }]} />}
    </div>
  );
};

export default AuthButton;
