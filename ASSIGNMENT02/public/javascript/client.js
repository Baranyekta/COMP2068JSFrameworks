// public\javascript\client.js
document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('taskList');

    // to render tasks
    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Deadline: ${task.deadline}</p>
            `;
            taskList.appendChild(li);
        });
    };

    // fetch tasks from server
    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    // handling form submission
    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addTaskForm);
        const newTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            deadline: formData.get('deadline')
        };

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
            if (response.ok) {
                fetchTasks();
                addTaskForm.reset();
            } else {
                console.error('Failed to add task:', response.statusText);
            }
        } catch (err) {
            console.error('Error adding task:', err);
        }
    });

    // initial task fetch of when page loads
    fetchTasks();
});