import prisma from "../config/prisma.js";

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        pid,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;

    if (!pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "pname, price and quantity are required",
      });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({
        message: "price and quantity must not be negative",
      });
    }

    const product = await prisma.product.create({
      data: {
        pname,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const pid = Number(req.params.id);
    const { pname, price, quantity } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: {
        pid,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      price !== undefined &&
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "price must not be negative",
      });
    }

    if (
      quantity !== undefined &&
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message: "quantity must not be negative",
      });
    }

    const product = await prisma.product.update({
      where: {
        pid,
      },
      data: {
        pname: pname ?? existingProduct.pname,
        price:
          price !== undefined
            ? Number(price)
            : existingProduct.price,
        quantity:
          quantity !== undefined
            ? Number(quantity)
            : existingProduct.quantity,
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: {
        pid,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: {
        pid,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};