import express from "express";

import {
  getAllMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} from "../controllers/membership.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllMemberships);

router.get("/:id", getMembershipById);

router.post("/", authenticateToken, createMembership);

router.put("/:id", authenticateToken, updateMembership);

router.delete("/:id", authenticateToken, deleteMembership);

export default router;