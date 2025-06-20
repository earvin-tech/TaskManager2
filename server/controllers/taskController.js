const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");

// Helper to throw error with status
const throwError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

// POST /api/tasks
const createTask = catchAsync(async (request, response) => {
  delete request.body.user;

  const task = new Task({
    ...request.body,
    user: request.user._id,
  });

  await task.save();
  response.status(201).json(task);
});

// GET /api/tasks
const getAllTasks = catchAsync(async (request, response) => {
  const filters = { user: request.user._id };

  if (request.query.status) {
    filters.status = request.query.status;
  }

  const sortField = request.query.sortBy || "createdAt";
  const sortOptions = { [sortField]: request.query.order === "desc" ? -1 : 1 };

  const tasks = await Task.find(filters).sort(sortOptions);
  response.status(200).json(tasks);
});

// GET /api/tasks/:id
const getTaskById = catchAsync(async (request, response) => {
  const task = await Task.findOne({
    _id: request.params.id,
    user: request.user._id,
  });

  if (!task) {
    throwError("Task not found", 404);
  }

  response.status(200).json(task);
});

// PATCH /api/tasks/:id
const updateTask = catchAsync(async (request, response) => {
  delete request.body.user;

  const task = await Task.findOneAndUpdate(
    { _id: request.params.id, user: request.user._id },
    request.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    throwError("Task not found", 404);
  }

  response.status(200).json(task);
});

// DELETE /api/tasks/:id
const deleteTask = catchAsync(async (request, response) => {
  const task = await Task.findOneAndDelete({
    _id: request.params.id,
    user: request.user._id,
  });

  if (!task) {
    throwError("Task not found", 404);
  }

  response.status(200).json({ message: "Task deleted successfully" });
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};