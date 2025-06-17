const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required:[true, "Subtask title is required"],
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const Subtask = mongoose.model("Subtask", subtaskSchema);

module.exports = Subtask;