import { Router } from "express";
import { createScheme } from "./admin.controller.js";
// import { adminAuth } from "../../middlewares/adminAuth.middleware";

const router = Router();

// 🔒 add adminAuth later
router.post("/schemes", createScheme);

export default router;
