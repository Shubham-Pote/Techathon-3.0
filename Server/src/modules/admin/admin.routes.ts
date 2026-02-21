import { Router } from "express";
import { createScheme } from "./admin.controller.js";

const router = Router();

router.post("/schemes", createScheme);

export default router;
