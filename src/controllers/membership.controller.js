import prisma from "../config/prisma.js";

// GET ALL MEMBERSHIPS
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await prisma.membership.findMany();

    return res.status(200).json(memberships);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET MEMBERSHIP BY ID
export const getMembershipById = async (req, res) => {
  try {
    const mid = Number(req.params.id);

    const membership = await prisma.membership.findUnique({
      where: {
        mid,
      },
    });

    if (!membership) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    return res.status(200).json(membership);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CREATE MEMBERSHIP
export const createMembership = async (req, res) => {
  try {
    const { mname, score } = req.body;

    if (!mname || score === undefined) {
      return res.status(400).json({
        message: "mname and score are required",
      });
    }

    const membership = await prisma.membership.create({
      data: {
        mname,
        score: Number(score),
      },
    });

    return res.status(201).json({
      message: "Membership created successfully",
      membership,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE MEMBERSHIP
export const updateMembership = async (req, res) => {
  try {
    const mid = Number(req.params.id);
    const { mname, score } = req.body;

    const existingMembership =
      await prisma.membership.findUnique({
        where: {
          mid,
        },
      });

    if (!existingMembership) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    const membership = await prisma.membership.update({
      where: {
        mid,
      },
      data: {
        mname,
        score: Number(score),
      },
    });

    return res.status(200).json({
      message: "Membership updated successfully",
      membership,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE MEMBERSHIP
export const deleteMembership = async (req, res) => {
  try {
    const mid = Number(req.params.id);

    const existingMembership =
      await prisma.membership.findUnique({
        where: {
          mid,
        },
      });

    if (!existingMembership) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    await prisma.membership.delete({
      where: {
        mid,
      },
    });

    return res.status(200).json({
      message: "Membership deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};