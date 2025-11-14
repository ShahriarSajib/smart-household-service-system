import express from "express";
import {
  changePassword,
  forgotPassword,
  login,
  registerUser,
  registerWorker,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import {
  verifyToken
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/user", registerUser);
router.post("/register/worker", registerWorker);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", verifyToken, changePassword);
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

export default router;
