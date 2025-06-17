const express = require("express");
const { registerUser, loginUser, updateUserPassword, deleteUser } = require("../controllers/userController");

const router = express.Router();

// POST Register
router.post("/register", registerUser);

// POST Login
router.post("/login", loginUser);

// PATCH Update Password
router.patch("/update-password", updateUserPassword);

// DELETE
router.delete("/", deleteUser)

module.exports = router;