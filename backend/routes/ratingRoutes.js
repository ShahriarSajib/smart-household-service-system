import express from "express";
import { addRating, getWorkerRatings } from "../controllers/ratingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add rating
router.post("/", verifyToken, addRating);

// Get ratings for a worker
router.get("/worker/:id", verifyToken, getWorkerRatings);

export default router;
