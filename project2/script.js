// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// Stats Elements
const countAll = document.getElementById("count-all");
const countPending = document.getElementById("count-pending");
const countCompleted = document.getElementById("count-completed");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// State
let tasks = JSON.parse(localStorage.getItem("aditya_edutasks")) || [
  {
    id: 1,
    text: "Complete Web Development Portfolio Project",
    category: "Project",
    dueDate: "2026-11-25",
    completed: true,
  },
  {
    id: 2,
    text: "Revise Data Structures & Algorithms Notes",
    category: "Exam Prep",
    dueDate: "2026-11-28",
    completed: false,
  },
];

let currentFilter = "all";

// Save to localStorage
function saveTasks() {
  localStorage.setItem("aditya_edutasks", JSON.stringify(tasks));
}

// Update Counts and Progress Bar
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  countAll.textContent = total;
  countPending.textContent = pending;
  countCompleted.textContent = completed;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressText.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

// Render Tasks based on active filter
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-left">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? "checked" : ""} 
          onchange="toggleTask(${task.id})"
        />
        <div class="task-details">
          <span class="task-title">${escapeHTML(task.text)}</span>
          <div class="task-meta">
            <span class="tag">${escapeHTML(task.category)}</span>
            ${task.dueDate ? `<span>📅 Due: ${task.dueDate}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="action-btn edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

// Add New Task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    category: categoryInput.value,
    dueDate: dateInput.value,
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

// Toggle Complete Status
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const updatedText = prompt("Edit your task:", task.text);
  if (updatedText !== null && updatedText.trim() !== "") {
    task.text = updatedText.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Filter Buttons
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Clear Completed Tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

// Prevent XSS in task text
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[tag]));
}

// Initial Render
renderTasks();
