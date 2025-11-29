import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * OAuth コールバックページ
 * Google OAuth 認証後のリダイレクト先
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // URL のハッシュから認証情報を取得
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        router.push("/?error=auth_failed");
        return;
      }

      // 認証成功後、トップページへリダイレクト
      router.push("/");
    };

    handleCallback();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <LoadingSpinner label="認証処理中..." />
    </div>
  );
}
