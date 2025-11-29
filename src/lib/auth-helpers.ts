import type { NextApiRequest } from "next";
import { supabase } from "@/lib/supabase";

/**
 * API リクエストから認証済みユーザーIDを取得
 * Authorization ヘッダーのトークンから user_id を抽出
 */
export async function getUserIdFromRequest(
  req: NextApiRequest
): Promise<string | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch {
    return null;
  }
}

/**
 * 認証必須のAPIハンドラー用ヘルパー
 * ユーザーIDを取得できない場合は401エラーを返す
 */
export async function requireAuth(req: NextApiRequest): Promise<string> {
  const userId = await getUserIdFromRequest(req);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}
