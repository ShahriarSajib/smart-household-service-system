import express from "express";
import { 
    approveWorker, 
    getPendingWorkers, 
    getWorkRequests,
    getAdminProfile,
    updateAdminProfile
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only admin can view and approve workers
router.get("/workers/pending", verifyToken, requireAdmin, getPendingWorkers);
router.put("/workers/:id/approve", verifyToken, requireAdmin, approveWorker);
router.get("/work-requests", requireAdmin, getWorkRequests);
router.get("/profile", requireAdmin, getAdminProfile);
router.put("/profile/update", requireAdmin, updateAdminProfile);

export default router;
