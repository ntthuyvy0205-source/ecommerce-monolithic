import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createOrder);

router.get("/", authenticateToken, getMyOrders);

router.get("/:id", authenticateToken, getOrderById);

export default router;