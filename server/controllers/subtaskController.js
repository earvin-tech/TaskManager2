const Subtask = require("../models/Subtask");
const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");

// 🔐 Helper to check if a task belongs to the user
const verifyTaskOwnership = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task || task.user.toString() !== userId.toString()) {
    const error = new Error("Unauthorized or task not found");
    error.status = 403;
    throw error;
  }
};

// POST /api/tasks/:taskId/subtasks
const createSubtask = catchAsync(async (request, response) => {
  await verifyTaskOwnership(request.params.taskId, request.user._id);

  const subtask = new Subtask({
    ...request.body,
    task: request.params.taskId,
  });

  await subtask.save();
  response.status(201).json(subtask);
});

// GET /api/tasks/:taskId/subtasks
const getSubtasksForTask = catchAsync(async (request, response) => {
  await verifyTaskOwnership(request.params.taskId, request.user._id);

  const subtasks = await Subtask.find({ task: request.params.taskId });
  response.status(200).json(subtasks);
});

// PATCH /api/subtasks/:id
const updateSubtask = catchAsync(async (request, response) => {
  const subtask = await Subtask.findById(request.params.id);
  if (!subtask) {
    response.status(404);
    throw new Error("Subtask not found");
  }

  await verifyTaskOwnership(subtask.task, request.user._id);

  Object.assign(subtask, request.body);
  await subtask.save();

  response.status(200).json(subtask);
});

// DELETE /api/subtasks/:id
const deleteSubtask = catchAsync(async (request, response) => {
  const subtask = await Subtask.findById(request.params.id);
  if (!subtask) {
    response.status(404);
    throw new Error("Subtask not found");
  }

  await verifyTaskOwnership(subtask.task, request.user._id);

  await subtask.deleteOne();
  response.status(200).json({ message: "Subtask deleted successfully" });
});

module.exports = {
  createSubtask,
  getSubtasksForTask,
  updateSubtask,
  deleteSubtask,
};
