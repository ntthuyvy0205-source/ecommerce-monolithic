import express from "express";

import {
  createShipment,
  getMyShipments,
  getShipmentById,
  updateShipment,
} from "../controllers/shipment.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createShipment);

router.get("/", authenticateToken, getMyShipments);

router.get("/:id", authenticateToken, getShipmentById);

router.put("/:id", authenticateToken, updateShipment);

export default router;