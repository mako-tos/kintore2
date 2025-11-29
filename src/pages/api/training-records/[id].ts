import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingRecordRepository } from "@/repositories/training-record";
import { requireAuth } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid record ID" });
    return;
  }

  const repository = TrainingRecordRepository.getInstance();
  // 認証必須
  const userId = await requireAuth(req);

  try {
    switch (req.method) {
      case "DELETE":
        await repository.delete(id, userId);
        res.status(204).end();
        break;

      default:
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in training-record API:", error);
    res.status(500).json({ message: error.message });
  }
}
