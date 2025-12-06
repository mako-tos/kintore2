import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingMenu } from "@/types/training-menu";
import { TrainingMenuRepository } from "@/repositories/training-menu";
import { requireAuth } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingMenu[] | { message: string }>
) {
  const repository = TrainingMenuRepository.getInstance();

  try {
    // 認証必須
    const userId = await requireAuth(req);

    switch (req.method) {
      case "GET": {
        const statusParam = req.query.status;
        let status: number | undefined;

        if (statusParam === "active") {
          status = 0;
        } else if (statusParam === "inactive") {
          status = 1;
        }

        const menus = await repository.findAll(userId, status);
        res.status(200).json(menus);
        break;
      }
      case "POST": {
        if (!req.body.name || typeof req.body.name !== "string") {
          res
            .status(400)
            .json({ message: "Invalid request: name is required" });
          return;
        }
        const newMenu = await repository.create(req.body.name, userId);
        res.status(201).json([newMenu]);
        break;
      }
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.error("Error in training-menus API:", error);
    res.status(500).json({ message: error.message });
  }
}
