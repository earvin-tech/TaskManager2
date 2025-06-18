const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");

// POST /api/users/register
const registerUser = catchAsync( async (request, response) => {
    const { username, email, password } = request.body;

    const existing = await User.findOne({ email });
    if (existing) {
        response.status(409);
        throw new Error("Email already in use");
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
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    response.status(401);
    throw new Error("Invalid email or password");
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

// DELETE /api/users
const deleteUser = catchAsync( async (request, response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
        response.status(401);
        throw new Error("Invalid credentials");
    }

    await User.deleteOne({ _id: user._id });

    response.status(200).json({
        message: "User deleted successfully"
    });
});

// PUT /api/users/update-password
const updateUserPassword = catchAsync(async (request, response) => {
    const { email, oldPassword, newPassword } = request.body;

    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(oldPassword)) {
        response.status(401);
        throw new Error("Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    response.status(200).json({
        message: "Password updated successfully"
    });
});

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUserPassword,
};

