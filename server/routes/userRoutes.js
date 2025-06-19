const express = require("express");
const {
    registerUser,
    loginUser,
    updateUserPassword,
    deleteUser,
    getCurrentUser,
} = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
    validateRegister,
    validatePasswordUpdate,
    validateLogin,
    validateDeleteUser
} = require("../middleware/validateUserInput");

// POST Register
router.post("/register", validateRegister, registerUser);

// POST Login
router.post("/login", validateLogin, loginUser);

// PATCH Update Password
router.patch("/update-password", requireAuth, validatePasswordUpdate, updateUserPassword);

// DELETE
router.delete("/", requireAuth, validateDeleteUser, deleteUser)

// GET Get current user details (email, username only)
router. get("/me", requireAuth, getCurrentUser);

module.exports = router;