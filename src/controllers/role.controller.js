import prisma from "../config/prisma.js";

// GET ALL ROLES
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();

    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ROLE BY ID
export const getRoleById = async (req, res) => {
  try {
    const roleid = Number(req.params.id);

    const role = await prisma.role.findUnique({
      where: {
        roleid,
      },
    });

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CREATE ROLE
export const createRole = async (req, res) => {
  try {
    const { rolename } = req.body;

    if (!rolename) {
      return res.status(400).json({
        message: "rolename is required",
      });
    }

    const role = await prisma.role.create({
      data: {
        rolename,
      },
    });

    return res.status(201).json({
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE ROLE
export const updateRole = async (req, res) => {
  try {
    const roleid = Number(req.params.id);
    const { rolename } = req.body;

    const existingRole = await prisma.role.findUnique({
      where: {
        roleid,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const role = await prisma.role.update({
      where: {
        roleid,
      },
      data: {
        rolename,
      },
    });

    return res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE ROLE
export const deleteRole = async (req, res) => {
  try {
    const roleid = Number(req.params.id);

    const existingRole = await prisma.role.findUnique({
      where: {
        roleid,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    await prisma.role.delete({
      where: {
        roleid,
      },
    });

    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};