const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For generating unique task IDs

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

// Get tasks by user
app.get('/tasks/:user', (req, res) => {
    const { user } = req.params;
    const userTasks = tasks.filter(task => task.user === user);
    res.json(userTasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const task = req.body;
    task._id = uuidv4(); // Assign a unique ID to the task
    tasks.push(task);
    res.status(201).send(task);
});

// Mark a task as completed (PATCH request)
app.patch('/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;

    const taskIndex = tasks.findIndex(task => task._id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed; // Update task completion status
        res.status(200).send(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Delete a task
app.delete('/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;

    const taskIndex = tasks.findIndex(task => task._id === taskId);
    
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1); // Remove task from the array
        res.status(204).send(); // No content, as the task is deleted
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
