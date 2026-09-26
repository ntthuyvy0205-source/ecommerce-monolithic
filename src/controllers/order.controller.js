import prisma from "../config/prisma.js";
import {
  createOrderService,
} from "../services/order.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { items } = req.body;

    const order = await createOrderService(uid, items);

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL ORDERS OF CURRENT USER
export const getMyOrders = async (req, res) => {
  try {
    const uid = req.user.uid;

    const orders = await prisma.order.findMany({
      where: {
        uid,
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        shipments: true,
      },
      orderBy: {
        oid: "desc",
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const oid = Number(req.params.id);
    const uid = req.user.uid;

    const order = await prisma.order.findFirst({
      where: {
        oid,
        uid,
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        shipments: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};