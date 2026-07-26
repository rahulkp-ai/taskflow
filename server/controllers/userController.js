import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";

// POST - Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user.isActive) {
    return res.status(401).json({
      status: false,
      message: "Account deactivated. Contact the administrator.",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  createJWT(res, user._id);

  user.password = undefined;
  res.status(200).json(user);
});

// POST - Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, role, title } = req.body;

  if (!name || !email || !password || !role || !title) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required." });
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    return res
      .status(400)
      .json({ status: false, message: "Email address already exists." });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    isAdmin: isAdmin || false,
    role,
    title,
  });

  if (user) {
    if (isAdmin) {
      createJWT(res, user._id);
    }
    user.password = undefined;
    res.status(201).json(user);
  } else {
    res.status(400).json({ status: false, message: "Invalid user data." });
  }
});

// POST - Logout user
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ status: true, message: "Logged out successfully." });
};

// GET - Get all team members
const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  const users = await User.find(query).select(
    "name title role email isActive _id"
  );
  res.status(200).json(users);
});

// GET - Get user notifications
const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notices = await Notice.find({
    team: userId,
    isRead: { $nin: [userId] },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(200).json(notices);
});

// GET - Get user task status
const getUserTaskStatus = asyncHandler(async (req, res) => {
  const tasks = await User.find()
    .populate("tasks", "title stage")
    .sort({ _id: -1 });

  res.status(200).json(tasks);
});

// PUT - Mark notifications as read
const markNotificationRead = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { isReadType, id } = req.query;

  if (isReadType === "all") {
    await Notice.updateMany(
      { team: userId, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } }
    );
  } else if (id) {
    await Notice.findOneAndUpdate(
      { _id: id, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } }
    );
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid request parameters." });
  }

  res.status(200).json({ status: true, message: "Notifications marked as read." });
});

// PUT - Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  // Determine which user to update
  const targetId =
    isAdmin && _id && userId !== _id ? _id : userId;

  const user = await User.findById(targetId);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found." });
  }

  user.name = req.body.name || user.name;
  user.title = req.body.title || user.title;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  res.status(200).json({
    status: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
});

// PUT - Activate or deactivate user
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found." });
  }

  user.isActive = req.body.isActive;
  await user.save();

  res.status(200).json({
    status: true,
    message: `User account has been ${user.isActive ? "activated" : "deactivated"}.`,
  });
});

// PUT - Change user password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      status: false,
      message: "Password must be at least 6 characters.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found." });
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    status: true,
    message: "Password changed successfully.",
  });
});

// DELETE - Delete user account
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found." });
  }

  res.status(200).json({ status: true, message: "User deleted successfully." });
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
};
