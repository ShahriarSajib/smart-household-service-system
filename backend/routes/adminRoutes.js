import express from "express";
import { 
  approveWorker, 
  getPendingWorkers, 
  getWorkRequests,
  getAdminProfile,
  updateAdminProfile,
  rejectWorker
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes must verify token first, then check role
router.get("/workers/pending", verifyToken, requireAdmin, getPendingWorkers);
router.put("/workers/:id/approve", verifyToken, requireAdmin, approveWorker);
router.put("/workers/:id/reject", verifyToken, requireAdmin, rejectWorker);

router.get("/work-requests", verifyToken, requireAdmin, getWorkRequests);
router.get("/profile", verifyToken, requireAdmin, getAdminProfile);
router.put("/profile/update", verifyToken, requireAdmin, updateAdminProfile);


export default router;
