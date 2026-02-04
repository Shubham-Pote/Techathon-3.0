import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import farmerRoutes from "./modules/farmer/farmer.routes.js";

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

// 🔐 Auth routes
app.use("/auth", authRoutes);
app.use("/farmers", farmerRoutes);

export default app;
