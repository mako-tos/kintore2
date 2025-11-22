declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_VERSION?: string;
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    // サーバ側のみで使用する Service Role Key（絶対にブラウザへ公開しない）
    SUPABASE_SERVICE_ROLE_KEY?: string;
  }
}
