const express = require("express");
const { 
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
 } = require("../controllers/taskController");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
    validateCreateTask,
    validateUpdateTask,
} = require("../middleware/validateTaskInput");

router.use(requireAuth);

 // All routes below will assume tasks are user-specific (request.user._id)

 // POST Create a new task
 router.post("/", validateCreateTask, createTask);

 // GET Get all tasks for the logged-in user
 router.get("/", getAllTasks);

 // GET Get one task by ID (must belong to user)
 router.get("/:id", getTaskById);

 // PATCH Update a task by ID (if user owns it)
 router.patch("/:id", validateUpdateTask, updateTask);

 // DELETE Delete a task by ID (if user owns it)
 router.delete(":id", deleteTask);

 module.exports = router;