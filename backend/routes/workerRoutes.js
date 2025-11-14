import express from "express";
import {
  getNearbyWorkers,
  getWorkerProfile,
  getWorkerRatings,
  getWorkerRequests,
  updateAvailability,
  updateWorkerLocation,
} from "../controllers/workerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/nearby", verifyToken, getNearbyWorkers);
router.put("/:id/location", verifyToken, updateWorkerLocation);
router.get("/:id", verifyToken, getWorkerProfile);
router.put("/:id/status", verifyToken, updateAvailability);
router.get("/:id/requests", verifyToken, getWorkerRequests);
router.get("/:id/ratings", verifyToken, getWorkerRatings);

export default router;
