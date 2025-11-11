import express from "express";
import { login, registerUser, registerWorker } from "../controllers/authController.js";

const router = express.Router();

router.post("/register/user", registerUser);
router.post("/register/worker", registerWorker);
router.post("/login", login);
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

export default router;
