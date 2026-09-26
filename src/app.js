import express from "express";
import cors from "cors";
import "dotenv/config";

import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);

// Route kiểm tra API
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Ecommerce Monolithic API is running",
  });
});

// Route kiểm tra kết nối database
app.get("/db-test", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "success",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: "UP",
      service: "ecommerce-api",
      database: "UP",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(503).json({
      status: "DOWN",
      service: "ecommerce-api",
      database: "DOWN",
    });
  }
});

// Khởi động server
async function startServer() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Cannot connect to PostgreSQL");
    console.error(error);
    process.exit(1);
  }
}

startServer();