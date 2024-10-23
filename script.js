// Select HTML elements
const taskInput = document.querySelector(".task-input input"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn"),
      taskBox = document.querySelector(".task-box");

// Initialize variables
let editId, // ID of the task being edited
    isEditTask = false, // boolean indicating whether a task is being edited
    todos = JSON.parse(localStorage.getItem("todo-list")); // array of todo items from local storage

// Add event listeners to filter buttons
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from previous filter button
    document.querySelector("span.active").classList.remove("active");
    // Add active class to clicked filter button
    btn.classList.add("active");
    // Call showTodo function with filter ID as argument
    showTodo(btn.id);
  });
});

// Show todo list based on filter
function showTodo(filter) {
  let liTag = ""; // HTML for todo list items
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        // Generate HTML for each todo item that matches the filter
        liTag += `<li class="task">
                    <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                      <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </li>`;
      }
    });
  }
  // Set innerHTML of taskBox element to generated HTML
  taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
  // Update visibility of clear all button and overflow class on taskBox
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

// Call showTodo function with "all" filter on page load
showTodo("all");

// Show menu for task settings
function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  // Add event listener to document to remove menu on outside click
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

// Update task status on checkbox click
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  // Update local storage with new todo list
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Edit task
function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}

// Delete task
function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

// Clear all tasks
clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

// Add new task or edit existing task on Enter key press
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
      if (!isEditTask) {
        // Add new task
        todos = !todos ? [] : todos;
        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo);
      } else {
        // Edit existing task
        isEditTask = false;
        todos[editId].name = userTask;
      }
      taskInput.value = "";
      localStorage.setItem("todo-list", JSON.stringify(todos));
      showTodo(document.querySelector("span.active").id);
    }
  });