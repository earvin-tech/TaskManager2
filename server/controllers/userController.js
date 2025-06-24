const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");

// Helper to throw error with status
const throwError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

// POST /api/users/register
const registerUser = catchAsync(async (request, response) => {
  const { username, email, password } = request.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throwError("Email already in use", 409);
  }

  const user = new User({ username, email, password });
  await user.save();

  const token = generateToken(user._id);

  response.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// POST /api/users/login
const loginUser = catchAsync(async (request, response) => {
  const { email, username, password } = request.body;

  const user = await User.findOne(email ? { email } : { username });

  if (!user || !user.comparePassword(password)) {
    throwError("Invalid credentials", 401);
  }

  const token = generateToken(user._id);

  response.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// DELETE /api/users/me
const deleteUser = catchAsync(async (request, response) => {
  const { password } = request.body;

  const user = await User.findById(request.user._id);
  if (!user || !user.comparePassword(password)) {
    throwError("Invalid credentials", 401);
  }

  await User.deleteOne({ _id: user._id });

  response.status(200).json({
    message: "User deleted successfully",
  });
});

// PATCH /api/users/me
const updateUserPassword = catchAsync(async (request, response) => {
  const { oldPassword, newPassword } = request.body;

  const user = await User.findById(request.user._id);
  if (!user || !user.comparePassword(oldPassword)) {
    throwError("Old password is incorrect", 401);
  }

  if (!newPassword) {
    throwError("New password is required", 400);
  }

  user.password = newPassword;
  await user.save();

  response.status(200).json({
    message: "Password updated successfully",
  });
});

// GET /api/users/me
const getCurrentUser = catchAsync(async (request, response) => {
  const user = await User.findById(request.user._id).select("-password -salt");

  if (!user) {
    throwError("User not found", 404);
  }

  response.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  updateUserPassword,
  getCurrentUser,
};