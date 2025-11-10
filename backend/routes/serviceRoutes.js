import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createRequest,
  getUserRequests,
  getWorkerRequests,
  completeRequest,
} from "../controllers/serviceController.js";

const router = express.Router();

// All require authentication
router.post("/", verifyToken, createRequest);
router.get("/user/:id", verifyToken, getUserRequests);
router.get("/worker/:id", verifyToken, getWorkerRequests);
router.put("/:id/complete", verifyToken, completeRequest);

export default router;
