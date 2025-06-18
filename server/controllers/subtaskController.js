const Subtask = require("../models/Subtask");
const catchAsync = require("../utils/catchAsync");

// POST /api/tasks/:taskId/subtasks
const createSubtask = catchAsync(async (request, response) => {
    const subtask = new Subtask({
        ...request.body,
        task: request.params.taskId, // link to parent task
    });

    await subtask.save();
    response.status(201).json(subtask);
});

// GET /api/tasks/:taskId/subtasks
const getSubtasksForTask = catchAsync(async (request, response) => {
    const subtasks = await Subtask.find({ task: request.params.taskId });
    response.status(200).json(subtasks);
});

// PATCH /api/subtasks/:id
const updateSubtask = catchAsync(async (request, response) => {
    const subtask = await Subtask.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true, runValidators: true }
    );

    if (!subtask) {
        response.status(404);
        throw new Error("Subtask not found");
    }

    response.status(200).json(subtask);
});

// DELETE /api/subtasks/:id
const deleteSubtask = catchAsync(async (request, response) => {
    const subtask = await Subtask.findByIdAndDelete(request.params.id);

    if (!subtask) {
        response.status(404);
        throw new Error("Subtask not found");
    }

    response.status(200).json({ message: "Subtask deleted successfully" });
});

module.exports = {
    createSubtask,
    getSubtasksForTask,
    updateSubtask,
    deleteSubtask,
};