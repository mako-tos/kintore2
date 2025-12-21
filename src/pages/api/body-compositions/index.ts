import type { NextApiRequest, NextApiResponse } from "next";
import { BodyComposition } from "@/types/body-composition";
import { BodyCompositionRepository } from "@/repositories/body-composition";
import { requireAuth } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BodyComposition | { message: string }>
) {
  const repository = BodyCompositionRepository.getInstance();

  try {
    const userId = await requireAuth(req);

    if (req.method === "POST") {
      const { date, weight, bodyFatMass, leanBodyMass, muscleMass } = req.body;

      // バリデーション
      if (
        !date ||
        weight === undefined ||
        bodyFatMass === undefined ||
        leanBodyMass === undefined ||
        muscleMass === undefined
      ) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const newRecord = await repository.create(userId, {
        date,
        weight: Number(weight),
        body_fat_mass: Number(bodyFatMass),
        lean_body_mass: Number(leanBodyMass),
        muscle_mass: Number(muscleMass),
      });

      res.status(201).json(newRecord);
    } else if (req.method === "GET") {
      const records = await repository.findByUserId(userId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.status(200).json(records as any);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
