import express from "express";
import { approveWorker, getPendingWorkers } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only admin can view and approve workers
router.get("/workers/pending", verifyToken, requireAdmin, getPendingWorkers);
router.put("/workers/:id/approve", verifyToken, requireAdmin, approveWorker);

export default router;
