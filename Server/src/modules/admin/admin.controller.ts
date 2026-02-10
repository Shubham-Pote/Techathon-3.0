import { Request, Response } from "express";
import { createSchemeService } from "./admin.service.js";

export const createScheme = async (req: Request, res: Response) => {
  try {
    const scheme = await createSchemeService(req.body);

    return res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      data: scheme
    });
  } catch (error: any) {
    console.error("Create scheme error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create scheme"
    });
  }
};
