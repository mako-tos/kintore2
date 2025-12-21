import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // プロフィール取得
      if (session?.user) {
        fetchProfile(session.user.id);
        tryBackfill();
      } else {
        setLoading(false);
      }
    });

    // 認証状態変更のリスナー
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // ログイン時にプロフィール取得とバックフィル実行
      if (session?.user) {
        fetchProfile(session.user.id);
        tryBackfill();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // プロフィール取得
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error("Profile fetch exception:", e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // 初回バックフィル処理（非同期、エラーは無視）
  const tryBackfill = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) return;

      await fetch("/api/auth/backfill", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 成功/失敗に関わらず無視（既に完了していれば何もしない）
    } catch (e) {
      // エラーは無視（ログだけ出す）
      console.log("Backfill attempt:", e);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
