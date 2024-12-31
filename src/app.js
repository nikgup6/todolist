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
    const tasks = JSON.parse(localStorage.getItem(`${user}-tasks`)) || [];
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const span = document.createElement('span');
        span.textContent = `${task.text} (${task.priority})`;
        span.classList.add(`priority-${task.priority}`);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(user, index));

        li.appendChild(checkbox);
        li.appendChild(span);

        if (task.completed) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => deleteTask(user, index));
            li.appendChild(deleteButton);
        }

        taskList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    ['nikunj', 'teju'].forEach(user => renderTasks(user));
});
