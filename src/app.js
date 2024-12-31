const BACKEND_URL = 'https://todolist-6y0h.onrender.com';

// Fetch tasks from the backend
async function fetchTasks(user) {
    const response = await fetch(`${BACKEND_URL}/tasks/${user}`);
    if (response.ok) {
        return response.json();
    } else {
        console.error('Failed to fetch tasks:', response.statusText);
        return [];
    }
}

// Add new task
async function addTask(user) {
    const input = document.getElementById(`${user}-task-input`);
    const priority = document.getElementById(`${user}-priority`).value;
    const taskText = input.value.trim();

    if (!taskText) return;

    const task = { user, text: taskText, priority, completed: false };

    try {
        const response = await fetch(`${BACKEND_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });

        if (response.ok) {
            input.value = '';
            await renderTasks(user); // Fetch and display updated tasks
        } else {
            console.error('Failed to add task:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Render tasks
async function renderTasks(user) {
    const taskList = document.getElementById(`${user}-tasks`);
    taskList.innerHTML = ''; // Clear the list

    try {
        const tasks = await fetchTasks(user);
        tasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const span = document.createElement('span');
            span.textContent = `${task.text} (${task.priority})`;
            span.classList.add(`priority-${task.priority}`);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', async () => {
                await toggleTask(user, task._id, !task.completed); // Toggle completion status
                await renderTasks(user); // Re-render tasks after update
            });

            li.appendChild(checkbox);
            li.appendChild(span);

            if (task.completed) {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.addEventListener('click', async () => {
                    await deleteTask(user, task._id); // Delete task
                    await renderTasks(user); // Re-render tasks after deletion
                });
                li.appendChild(deleteButton);
            }

            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error rendering tasks:', error);
    }
}

// Toggle task completion status
async function toggleTask(user, taskId, newStatus) {
    try {
        const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: newStatus }),
        });

        if (!response.ok) {
            console.error('Failed to toggle task:', response.statusText);
        }
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// Delete task
async function deleteTask(user, taskId) {
    try {
        const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error('Failed to delete task:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Render tasks for each user (example: nikunj, teju)
    ['nikunj', 'teju'].forEach(user => renderTasks(user));
});
