// public\javascript\client.js
document.addEventListener("DOMContentLoaded", () => {
  // get references to dom elements
  const addTaskForm = document.getElementById("addTaskForm");
  const taskList = document.getElementById("taskList");

  // function to render tasks
  const renderTasks = (tasks) => {
    taskList.innerHTML = ""; // clear previous tasks
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>deadline: ${task.deadline}</p>
            `;
      taskList.appendChild(li); // append each task to the task list
    });
  };

  // function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await fetch("/tasks"); // fetch tasks from server
      const tasks = await response.json(); // parse response json
      renderTasks(tasks); // render the fetched tasks
    } catch (err) {
      console.error("error fetching tasks:", err); // log any errors
    }
  };

  // event listener for form submission
  addTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission behavior
    const formData = new FormData(addTaskForm); // get form data
    const newTask = {
      // create object with form data
      title: formData.get("title"),
      description: formData.get("description"),
      deadline: formData.get("deadline"),
    };

    try {
      const response = await fetch("/tasks", {
        // send post requests to server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask), // convert newTask to json str
      });
      if (response.ok) {
        // if request is successful
        fetchTasks(); // fetch tasks to update task list
        addTaskForm.reset(); // reset the form
      } else {
        console.error("Failed to add task:", response.statusText);
      }
    } catch (err) {
      console.error("Error adding task:", err); // log error if it happens
    }
  });

  // initial task fetch of when page loads
  fetchTasks();
});
