import express from "express";
import { addTask, getTask, removeTask } from "../controllers/taskController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Add a new task
router.post("/addTask", requireAuth, addTask);

// Get all tasks for the authenticated user
router.get("/getTask", requireAuth, getTask);

// Remove a specific task by ID
router.delete("/removeTask/:id", requireAuth, removeTask); // Changed to DELETE and used route parameter

export default router;
