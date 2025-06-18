const express = require("express");
const {
    registerUser,
    loginUser,
    updateUserPassword,
    deleteUser
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

module.exports = router;