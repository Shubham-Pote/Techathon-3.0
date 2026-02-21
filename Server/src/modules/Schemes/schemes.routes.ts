import { Router } from "express";
import { getAllSchemes, getSchemeById, triggerScraper } from "./schemes.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/",  getAllSchemes);
router.get("/:schemeId", getSchemeById);
router.post("/scrape/trigger", triggerScraper);

export default router;