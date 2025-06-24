const express = require("express");
const {
  createSubtask,
  getSubtasksForTask,
  updateSubtask,
  deleteSubtask,
} = require("../controllers/subtaskController");

const {
  validateCreateSubtask,
  validateUpdateSubtask,
} = require("../middleware/validateSubtaskInput");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

// POST /api/tasks/:taskId/subtasks
router.post("/tasks/:taskId/subtasks", validateCreateSubtask, createSubtask);

// GET /api/tasks/:taskId/subtasks
router.get("/tasks/:taskId/subtasks", getSubtasksForTask);

// PATCH /api/subtasks/:id
router.patch("/subtasks/:id", validateUpdateSubtask, updateSubtask);

// DELETE /api/subtasks/:id
router.delete("/subtasks/:id", deleteSubtask);

module.exports = router;