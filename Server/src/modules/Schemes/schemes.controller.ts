import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { getAllSchemesService, getSchemeByIdService } from "./schemes.service.js";

export const getAllSchemes = async (req: AuthRequest, res: Response) => {
  try {
    const schemes = await getAllSchemesService(req.user);

    res.json({
      success: true,
      data: schemes
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getSchemeById = async (req: Request, res: Response) => {
  try {
    const scheme = await getSchemeByIdService(req.params.schemeId as string);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found"
      });
    }

    res.json({
      success: true,
      data: scheme
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
