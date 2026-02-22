import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  getAllSchemesService,
  getSchemeByIdService
} from "./schemes.service.js";
import { scrapeSchemes } from "../../jobs/scheme-scraper.js";

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

export const getSchemeById = async (
  req: Request<{ schemeId: string }>,
  res: Response
) => {
  try {
    const scheme = await getSchemeByIdService(req.params.schemeId);

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

export const triggerScraper = async (req: Request, res: Response) => {
  try {
    console.log("Manual scraper trigger initiated...");
    
    // Run scraper in background
    scrapeSchemes().then(() => {
      console.log("Scraper completed successfully");
    }).catch((err) => {
      console.error("Scraper failed:", err);
    });

    res.json({
      success: true,
      message: "Scraper triggered successfully. Check server logs and database for results."
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};