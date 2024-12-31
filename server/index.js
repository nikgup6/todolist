const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/tasks/:user', (req, res) => {
    const { user } = req.params;
    res.json(tasks.filter(task => task.user === user));
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.status(201).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
