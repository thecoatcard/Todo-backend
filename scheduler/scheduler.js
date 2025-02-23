// scheduler.js
const cron = require('node-cron');
const mongoose = require('mongoose'); // Assuming you are using mongoose for MongoDB operations
const Task = require('./models/Task'); // Assuming you have a Task model

// Function to handle the task you want to schedule
const scheduledTask = async () => {
  try {
    console.log('Running scheduled task...');
    
    // Example: Fetch tasks that need to be processed
    const tasksToProcess = await Task.find({ isCompleted: false, scheduled: true });
    
    // Process each task (this is just an example)
    tasksToProcess.forEach(async (task) => {
      // Perform your task processing logic here
      // For example, mark the task as completed after processing
      task.isCompleted = true;
      await task.save();
      console.log(`Processed task: ${task.title}`);
    });
    
  } catch (error) {
    console.error('Error running scheduled task:', error);
  }
};

// Schedule a task to run every minute
cron.schedule('* * * * *', () => {
  scheduledTask();
});

// Optionally, if you need to run the scheduler only after a successful DB connection
const startScheduler = () => {
  console.log('Scheduler started.');
};

// Export the start function
module.exports = { startScheduler };
