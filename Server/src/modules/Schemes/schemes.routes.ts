import { Router } from "express";
import { getAllSchemes, getSchemeById } from "./schemes.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/",  getAllSchemes);
router.get("/:schemeId", getSchemeById);

export default router;