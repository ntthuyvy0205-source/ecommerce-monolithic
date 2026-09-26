import prisma from "../config/prisma.js";

export const createOrderService = async (uid, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one product");
  }

  // Không cho trùng pid trong cùng một request
  const productIds = items.map((item) => Number(item.pid));

  if (new Set(productIds).size !== productIds.length) {
    throw new Error("Duplicate products are not allowed");
  }

  return await prisma.$transaction(async (tx) => {
    // Kiểm tra User
    const user = await tx.user.findUnique({
      where: {
        uid: Number(uid),
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const products = [];

    // Kiểm tra từng sản phẩm và tồn kho
    for (const item of items) {
      const pid = Number(item.pid);
      const qty = Number(item.qty);

      if (!Number.isInteger(qty) || qty <= 0) {
        throw new Error("Quantity must be a positive integer");
      }

      const product = await tx.product.findUnique({
        where: {
          pid,
        },
      });

      if (!product) {
        throw new Error(`Product ${pid} not found`);
      }

      if (product.quantity < qty) {
        throw new Error(
          `Product ${product.pname} does not have enough stock`
        );
      }

      products.push({
        product,
        qty,
      });
    }

    // Tạo Order
    const order = await tx.order.create({
      data: {
        uid: Number(uid),
        createat: new Date(),
      },
    });

    // Tạo OrderDetail và trừ tồn kho
    for (const item of products) {
      await tx.orderDetail.create({
        data: {
          oid: order.oid,
          pid: item.product.pid,
          qty: item.qty,
          unit_price: item.product.price,
        },
      });

      await tx.product.update({
        where: {
          pid: item.product.pid,
        },
        data: {
          quantity: {
            decrement: item.qty,
          },
        },
      });
    }

    // Trả về Order đầy đủ
    return await tx.order.findUnique({
      where: {
        oid: order.oid,
      },
      include: {
        user: {
          select: {
            uid: true,
            username: true,
            fullname: true,
          },
        },
        orderDetails: {
          include: {
            product: true,
          },
        },
      },
    });
  });
};