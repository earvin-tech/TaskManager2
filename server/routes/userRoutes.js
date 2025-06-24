const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserPassword,
  deleteUser,
  getCurrentUser,
} = require("../controllers/userController");

const {
  validateRegister,
  validatePasswordUpdate,
  validateLogin,
  validateDeleteUser,
} = require("../middleware/validateUserInput");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// POST /api/users — Register user
router.post("/register", validateRegister, registerUser);

// POST /api/users/login — Login
router.post("/login", validateLogin, loginUser);

// GET /api/users/me — Get current user
router.get("/me", requireAuth, getCurrentUser);

// PATCH /api/users/me — Update user password
router.patch("/me", requireAuth, validatePasswordUpdate, updateUserPassword);

// DELETE /api/users/me — Delete account
router.delete("/me", requireAuth, validateDeleteUser, deleteUser);

module.exports = router;