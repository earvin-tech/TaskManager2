const { body, validationResult } = require("express-validator");

// Shared handler
const handleValidationErrors = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create subtask
const validateCreateSubtask = [
  body("title")
    .trim()
    .notEmpty().withMessage("Subtask title is required")
    .isLength({ min: 1, max: 100 }).withMessage("Subtask title must be 1–100 characters"),

  body("completed")
    .optional()
    .isBoolean().withMessage("Completed must be a boolean"),

  handleValidationErrors,
];

// Update subtask
const validateUpdateSubtask = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage("Subtask title must be 1–100 characters"),

  body("completed")
    .optional()
    .isBoolean().withMessage("Completed must be a boolean"),

  handleValidationErrors,
];

module.exports = {
  validateCreateSubtask,
  validateUpdateSubtask,
};