const BACKEND_URL = 'https://todolist-6y0h.onrender.com';

async function fetchTasks(user) {
    const response = await fetch(`${BACKEND_URL}/tasks/${user}`);
    return response.json();
}

async function addTask(user) {
    const input = document.getElementById(`${user}-task-input`);
    const priority = document.getElementById(`${user}-priority`).value;
    const taskText = input.value.trim();

    if (!taskText) return;

    const task = { user, text: taskText, priority, completed: false };
    await fetch(`${BACKEND_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });

    input.value = '';
    renderTasks(user);
}

async function renderTasks(user) {
    const taskList = document.getElementById(`${user}-tasks`);
    const tasks = await fetchTasks(user);

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.text} (${task.priority})`;
        taskList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    ['nikunj', 'teju'].forEach(user => renderTasks(user));
});
