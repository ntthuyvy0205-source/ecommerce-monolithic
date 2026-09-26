import express from "express";

import {
  register,
  login,
} from "../controllers/auth.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    user: req.user,
  });
});

export default router;