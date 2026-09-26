import prisma from "../config/prisma.js";

// CREATE SHIPMENT
export const createShipment = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { oid, status } = req.body;

    if (!oid || !status) {
      return res.status(400).json({
        message: "oid and status are required",
      });
    }

    // Chỉ cho tạo shipment cho Order của chính user
    const order = await prisma.order.findFirst({
      where: {
        oid: Number(oid),
        uid,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const shipment = await prisma.shipment.create({
      data: {
        oid: Number(oid),
        status,
      },
    });

    return res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL SHIPMENTS OF CURRENT USER
export const getMyShipments = async (req, res) => {
  try {
    const uid = req.user.uid;

    const shipments = await prisma.shipment.findMany({
      where: {
        order: {
          uid,
        },
      },
      include: {
        order: true,
      },
      orderBy: {
        shipid: "desc",
      },
    });

    return res.status(200).json(shipments);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET SHIPMENT BY ID
export const getShipmentById = async (req, res) => {
  try {
    const shipid = Number(req.params.id);
    const uid = req.user.uid;

    const shipment = await prisma.shipment.findFirst({
      where: {
        shipid,
        order: {
          uid,
        },
      },
      include: {
        order: true,
      },
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    return res.status(200).json(shipment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE SHIPMENT STATUS
export const updateShipment = async (req, res) => {
  try {
    const shipid = Number(req.params.id);
    const uid = req.user.uid;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    const existingShipment = await prisma.shipment.findFirst({
      where: {
        shipid,
        order: {
          uid,
        },
      },
    });

    if (!existingShipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    const shipment = await prisma.shipment.update({
      where: {
        shipid,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Shipment updated successfully",
      shipment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};