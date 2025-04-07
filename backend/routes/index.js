import express from "express";
const router = express.Router();

import userRoutes from "./user.js";

// Sử dụng các routes
router.use("/users", userRoutes);

export default router;
