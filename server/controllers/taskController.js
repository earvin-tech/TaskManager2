const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");

// POST /api/tasks
const createTask = catchAsync(async (request, response) => {
  delete request.body.user; // prevent user spoofing

  const task = new Task({
    ...request.body,
    user: request.user._id, // force ownership
  });

  await task.save();
  response.status(201).json(task);
});

// GET /api/tasks
const getAllTasks = catchAsync(async (request, response) => {
  const tasks = await Task.find({ user: request.user._id });
  response.status(200).json(tasks);
});

// GET /api/tasks/:id
const getTaskById = catchAsync(async (request, response) => {
  const task = await Task.findOne({
    _id: request.params.id,
    user: request.user._id,
  });

  if (!task) {
    response.status(404);
    throw new Error("Task not found");
  }

  response.status(200).json(task);
});

// PATCH /api/tasks/:id
const updateTask = catchAsync(async (request, response) => {
  delete request.body.user; // prevent changing task ownership

  const task = await Task.findOneAndUpdate(
    { _id: request.params.id, user: request.user._id },
    request.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    response.status(404);
    throw new Error("Task not found");
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
    response.status(404);
    throw new Error("Task not found");
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
