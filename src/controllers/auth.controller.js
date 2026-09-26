import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      username,
      fullname,
      password,
      roleid,
      mid
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!username || !fullname || !password || !roleid || !mid) {
      return res.status(400).json({
        message: "Please provide username, fullname, password, roleid and mid",
      });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    // Kiểm tra Role
    const role = await prisma.role.findUnique({
      where: {
        roleid: Number(roleid),
      },
    });

    if (!role) {
      return res.status(400).json({
        message: "Role does not exist",
      });
    }

    // Kiểm tra Membership
    const membership = await prisma.membership.findUnique({
      where: {
        mid: Number(mid),
      },
    });

    if (!membership) {
      return res.status(400).json({
        message: "Membership does not exist",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo User
    const user = await prisma.user.create({
      data: {
        username,
        fullname,
        password: hashedPassword,
        roleid: Number(roleid),
        mid: Number(mid),
      },
      select: {
        uid: true,
        username: true,
        fullname: true,
        roleid: true,
        mid: true,
      },
    });

    return res.status(201).json({
      message: "Register successful",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username and password",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        role: true,
        membership: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        roleid: user.roleid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uid: user.uid,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
        membership: user.membership,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};