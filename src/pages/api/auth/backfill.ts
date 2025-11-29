import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth-helpers";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * 初回ログイン時のバックフィル処理
 * 既存の user_id が NULL のレコードを最初のログインユーザーで更新
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        success: boolean;
        updatedMenus: number;
        updatedRecords: number;
        message: string;
      }
    | { message: string }
  >
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    // 認証必須
    const userId = await requireAuth(req);

    // バックフィル関数を実行
    const { data, error } = await supabaseServer.rpc("backfill_user_data", {
      target_user_id: userId,
    });

    if (error) {
      // 既に実行済みの場合
      if (error.message.includes("already completed")) {
        res.status(200).json({
          success: true,
          updatedMenus: 0,
          updatedRecords: 0,
          message: "Backfill already completed",
        });
        return;
      }
      throw new Error(error.message);
    }

    const result = data[0];

    res.status(200).json({
      success: true,
      updatedMenus: result.updated_menus || 0,
      updatedRecords: result.updated_records || 0,
      message: "Backfill completed successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.error("Error in backfill API:", error);
    res.status(500).json({ message: error.message });
  }
}
