import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getWorkerProfile,
  updateAvailability,
  getWorkerRequests,
  getWorkerRatings,
} from "../controllers/workerController.js";

const router = express.Router();

// Protected routes
router.get("/:id", verifyToken, getWorkerProfile);
router.put("/:id/status", verifyToken, updateAvailability);
router.get("/:id/requests", verifyToken, getWorkerRequests);
router.get("/:id/ratings", verifyToken, getWorkerRatings);

export default router;
