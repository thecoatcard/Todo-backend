import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

// Configure nodemailer transporter
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

// Function to send email notifications
const sendMail = (email, subject, title, description) => {
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: subject,
        html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Error sending email:", error); // Log the error
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info.response);
            }
        });
    });
};

// Add a new task
const addTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Validate incoming request data
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const user = await userModel.findById(userId); // Find user by ID
        const newTask = new taskModel({ title, description, completed: false, userId });

        await newTask.save();
        await sendMail(user.email, "Task Added", title, description); // Wait for email to send
        return res.status(200).json({ message: "Task added successfully" });
    } catch (error) {
        console.error("Error adding task:", error); // Log the error
        return res.status(500).json({ message: "An error occurred while adding the task." });
    }
};

// Remove a task by ID
const removeTask = async (req, res) => {
    const { id } = req.params; // Extract ID from request parameters
    console.log("id: ", id);

    try {
        const task = await taskModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error); // Log the error
        return res.status(500).json({ message: error.message });
    }
};

// Get all tasks for the logged-in user
const getTask = async (req, res) => {
    try {
        const tasks = await taskModel.find({ userId: req.user.id });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error retrieving tasks:", error); // Log the error
        return res.status(500).json({ message: error.message });
    }
};

export { addTask, getTask, removeTask };
