import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Please log in." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select(
      "isAdmin email isActive"
    );

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "User not found." });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: false,
        message: "Account deactivated. Contact administrator.",
      });
    }

    req.user = {
      email: user.email,
      isAdmin: user.isAdmin,
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Not authorized. Token expired or invalid.",
    });
  }
});

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

export { isAdminRoute, protectRoute };
