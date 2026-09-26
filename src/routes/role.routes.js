import express from "express";

import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllRoles);

router.get("/:id", getRoleById);

router.post("/", authenticateToken, createRole);

router.put("/:id", authenticateToken, updateRole);

router.delete("/:id", authenticateToken, deleteRole);

export default router;