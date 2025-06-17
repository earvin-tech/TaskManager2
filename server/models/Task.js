const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required:[true, "Task title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["In-Progress", "Completed", "On-Hold",],
            default: "In-Progress",
        },
        due: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;