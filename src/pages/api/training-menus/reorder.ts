import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingMenuRepository } from "@/repositories/training-menu";
import { requireAuth } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = TrainingMenuRepository.getInstance();

  try {
    const userId = await requireAuth(req);

    if (req.method === "PUT" || req.method === "PATCH") {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        res
          .status(400)
          .json({ message: "Invalid request: items array is required" });
        return;
      }

      await repository.updateOrder(items, userId);
      res.status(200).json({ message: "Order updated" });
    } else {
      res.setHeader("Allow", ["PUT", "PATCH"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.error("Error in reorder API:", error);
    res.status(500).json({ message: error.message });
  }
}
