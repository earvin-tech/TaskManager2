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

// POST Register
router.post("/register", registerUser);

// POST Login
router.post("/login", loginUser);

// PATCH Update Password
router.patch("/update-password", requireAuth, updateUserPassword);

// DELETE
router.delete("/", requireAuth, deleteUser)

// GET Get current user details (email, username only)
router. get("/me", requireAuth, getCurrentUser);

module.exports = router;