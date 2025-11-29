import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingMenuRepository } from "@/repositories/training-menu";
import { requireAuth } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid menu ID" });
    return;
  }

  const repository = TrainingMenuRepository.getInstance();

  // 認証必須
  const userId = await requireAuth(req);

  try {
    switch (req.method) {
      case "GET": {
        const menu = await repository.findById(id, userId);
        if (!menu) {
          res.status(404).json({ message: "Training menu not found" });
          return;
        }
        res.status(200).json(menu);
        break;
      }

      case "PUT": {
        if (!req.body.name || typeof req.body.name !== "string") {
          res
            .status(400)
            .json({ message: "Invalid request: name is required" });
          return;
        }
        const updatedMenu = await repository.update(id, req.body.name, userId);
        res.status(200).json(updatedMenu);
        break;
      }
      case "DELETE": {
        await repository.delete(id, userId);
        res.status(204).end();
        break;
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in training-menu API:", error);
    res.status(500).json({ message: error.message });
  }
}
