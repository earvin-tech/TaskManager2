const { body, validationResult } = require("express-validator");

// Common error handler
const handleValidationErrors = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

// Validator for registration
const validateRegister = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

  body("email")
    .trim()
    .isEmail().withMessage("Email must be valid"),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/\d/).withMessage("Password must contain a number")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain a special character (!@#$%^&*)"),

  handleValidationErrors,
];

// Validator for password update
const validatePasswordUpdate = [
  body("oldPassword")
    .notEmpty().withMessage("Please enter your old password"),

  body("newPassword")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/\d/).withMessage("Password must contain a number")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain a special character (!@#$%^&*)"),

  handleValidationErrors,
];

// Validator for login
const validateLogin = [
  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .isEmail().withMessage("If logging in by email, email must be valid"),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage("If logging in by username, username must be at least 3 characters"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  body().custom((body) => {
    if (!body.email && !body.username) {
      throw new Error("Either email or username is required");
    }
    return true;
  }),

  handleValidationErrors,
];

// Validator for account deletion
const validateDeleteUser = [
  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validatePasswordUpdate,
  validateLogin,
  validateDeleteUser,
};