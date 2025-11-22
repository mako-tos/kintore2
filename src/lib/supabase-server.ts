import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("Missing Supabase URL");
}

// サーバ側のみ service role を利用（RLSバイパス）。
// クライアント側に service role key をバンドルしないよう、このファイルは API ルート／サーバ専用で使う。
export const supabaseServer = createClient(url, service || anon, {
  auth: { persistSession: false },
});
