import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // For logging requests
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "PORT", "JWT_SECRET", "GMAIL_USERNAME", "GMAIL_PASSWORD", "FRONTEND_URL"];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

// App config
const app = express();
const port = process.env.PORT || 8001;
mongoose.set("strictQuery", true);

// Middlewares
app.use(morgan("combined")); // Log requests
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL, // Use FRONTEND_URL from .env
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials if needed
}));

// Database configuration
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Helps to avoid deprecation warnings
})
.then(() => console.log("DB Connected"))
.catch((err) => console.error("DB Connection Error:", err));

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Listen
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
