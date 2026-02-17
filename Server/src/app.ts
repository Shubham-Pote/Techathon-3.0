import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import farmerRoutes from "./modules/farmer/farmer.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import schemeRoutes from "./modules/Schemes/schemes.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use("/auth", authRoutes);
app.use("/farmers", farmerRoutes);
app.use("/admin", adminRoutes);
app.use("/schemes", schemeRoutes);

export default app;