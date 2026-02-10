import { Router } from "express";
import { getAllSchemes, getSchemeById } from "./schemes.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Farmer must be logged in
router.get("/", authMiddleware, getAllSchemes);
router.get("/:schemeId", authMiddleware, getSchemeById);

export default router;
