import mongoose from "mongoose";

// Task schema definition
const taskInstance = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Use ObjectId for user reference
    completed: { type: Boolean, default: false, required: true }, // Set default to false
}, { timestamps: true });

// Create and export the task model
const taskModel = mongoose.model("Task", taskInstance);
export default taskModel;
