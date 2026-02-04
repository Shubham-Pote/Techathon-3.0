import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getMyProfile, updateMyProfile } from "./farmer.controller.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

export default router;
