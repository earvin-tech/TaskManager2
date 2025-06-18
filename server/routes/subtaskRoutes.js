const express = require("express");
const {
    createSubtask,
    getSubtasksForTask,
    updateSubtask,
    deleteSubtask,
} = require("../controllers/subtaskController");
const router = express.Router({ mergeParams: true });
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/tasks/:taskId/subtasks", createSubtask);
router.get("/tasks/:taskId/subtasks", getSubtasksForTask);
router.patch("/subtasks/:id", updateSubtask);
router.delete("/subtasks/:id", deleteSubtask);

module.exports = router;