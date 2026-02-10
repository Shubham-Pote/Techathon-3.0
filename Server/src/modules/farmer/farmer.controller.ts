import { Response } from "express";
import prisma from "../../config/db.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

// GET /farmers/me
export async function getMyProfile(req: AuthRequest, res: Response) {
  const farmerId = req.user!.farmerId;

  const farmer = await prisma.farmer.findUnique({
    where: { id: farmerId },
  });

  res.json(farmer);
}

// PUT /farmers/me
export async function updateMyProfile(req: AuthRequest, res: Response) {
  const farmerId = req.user!.farmerId;
  const { state, landSizeAcres, crops } = req.body;

  const farmer = await prisma.farmer.update({
    where: { id: farmerId },
    data: { state ,
      landSizeAcres,
      crops},
  });

  res.json({
    message: "Profile updated successfully",
    farmer,
  });
}
