const { body, validationResult } = require("express-validator");

// Shared error handler
const handleValidationErrors = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validator for creating a new task
const validateCreateTask = [
  body("title")
    .trim()
    .notEmpty().withMessage("Task title is required")
    .isLength({ max: 100 }).withMessage("Task title must be at most 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Description can be up to 300 characters"),

  body("status")
    .optional()
    .isIn(["In-Progress", "Completed", "On-Hold"]).withMessage("Status must be one of: In-Progress, Completed, On-Hold"),

  body("due")
    .optional()
    .isISO8601().toDate().withMessage("Due date must be a valid date"),

  // No validation for `user` because it's injected in controller and spoofing is blocked

  handleValidationErrors,
];

// Validator for updating an existing task
const validateUpdateTask = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Task title must be at most 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Description can be up to 300 characters"),

  body("status")
    .optional()
    .isIn(["In-Progress", "Completed", "On-Hold"]).withMessage("Status must be one of: In-Progress, Completed, On-Hold"),

  body("due")
    .optional()
    .isISO8601().toDate().withMessage("Due date must be a valid date"),

  handleValidationErrors,
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};