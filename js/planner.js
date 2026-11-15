/* =========================================================
   planner.js - Academic Planner (interactive task manager)
   Add tasks, mark them completed, delete them, filter them.
   Tasks are stored in an array and saved to localStorage.
   ========================================================= */

const STORAGE_KEY = "cos106-planner-tasks";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const courseInput = document.getElementById("task-course");
const dateInput = document.getElementById("task-date");
const priorityInput = document.getElementById("task-priority");
const taskError = document.getElementById("task-error");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const template = document.getElementById("task-template");
const clearDoneBtn = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter-btn");

// Returns a YYYY-MM-DD date string a number of days from today
function daysFromToday(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

const sampleTasks = [
  { id: 1, title: "Complete COS 106 term project", course: "COS 106", due: daysFromToday(3), priority: "high", done: false },
  { id: 2, title: "Revise HTML forms and tables", course: "COS 106", due: daysFromToday(-1), priority: "medium", done: true },
  { id: 3, title: "Read chapter 2 of Mathematics notes", course: "MTH 101", due: daysFromToday(7), priority: "low", done: false }
];

let tasks = loadTasks();
let currentFilter = "all";

/* ---------- Storage ---------- */
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    /* storage unavailable: fall back to sample tasks */
  }
  return sampleTasks.slice();
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    /* ignore - planner still works for this visit */
  }
}

/* ---------- Helpers ---------- */
function formatDate(isoDate) {
  if (!isoDate) return "No due date";
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(task) {
  if (!task.due || task.done) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due + "T00:00:00") < today;
}

function getVisibleTasks() {
  if (currentFilter === "pending") return tasks.filter(function (t) { return !t.done; });
  if (currentFilter === "done") return tasks.filter(function (t) { return t.done; });
  return tasks;
}

/* ---------- Rendering (DOM manipulation) ---------- */
function createTaskElement(task) {
  const item = template.content.firstElementChild.cloneNode(true);
  item.dataset.id = task.id;
  item.classList.add("priority-" + task.priority);
  item.classList.toggle("done", task.done);

  const checkbox = item.querySelector("input[type='checkbox']");
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", "Mark \"" + task.title + "\" as completed");

  item.querySelector(".task-title").textContent = task.title;

  const meta = item.querySelector(".task-meta");
  const parts = [];
  if (task.course) parts.push(task.course);
  parts.push(task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + " priority");
  meta.textContent = parts.join(" · ") + " · ";
  const due = document.createElement("span");
  due.textContent = isOverdue(task) ? "Overdue: " + formatDate(task.due) : "Due: " + formatDate(task.due);
  if (isOverdue(task)) due.className = "overdue";
  meta.appendChild(due);

  item.querySelector(".task-delete").setAttribute("aria-label", "Delete \"" + task.title + "\"");
  return item;
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(function (t) { return t.done; }).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-pending").textContent = total - done;
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").textContent = percent + "% complete";
  clearDoneBtn.hidden = done === 0;
}

function renderTasks() {
  taskList.innerHTML = "";
  const visible = getVisibleTasks();
  visible.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });

  emptyState.hidden = visible.length > 0;
  if (!visible.length) {
    emptyState.textContent = currentFilter === "all"
      ? "No tasks here yet. Add your first task! 📚"
      : "No " + (currentFilter === "done" ? "completed" : "pending") + " tasks.";
  }
  updateStats();
}

/* ---------- Actions ---------- */
function addTask(title, course, due, priority) {
  tasks.unshift({
    id: Date.now(),
    title: title,
    course: course,
    due: due,
    priority: priority,
    done: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    return t.id === id ? Object.assign({}, t, { done: !t.done }) : t;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id, element) {
  element.classList.add("removing");
  setTimeout(function () {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    renderTasks();
  }, 250);
}

/* ---------- Event handling ---------- */
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (title === "") {
    taskError.textContent = "Please enter a task before adding it.";
    titleInput.classList.add("invalid");
    titleInput.focus();
    return;
  }

  taskError.textContent = "";
  titleInput.classList.remove("invalid");
  addTask(title, courseInput.value.trim().toUpperCase(), dateInput.value, priorityInput.value);
  taskForm.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

titleInput.addEventListener("input", function () {
  if (titleInput.value.trim()) {
    taskError.textContent = "";
    titleInput.classList.remove("invalid");
  }
});

// Event delegation: one listener handles every task's checkbox and delete button
taskList.addEventListener("change", function (event) {
  if (event.target.matches("input[type='checkbox']")) {
    const id = Number(event.target.closest(".task-item").dataset.id);
    toggleTask(id);
  }
});

taskList.addEventListener("click", function (event) {
  const button = event.target.closest(".task-delete");
  if (button) {
    const item = button.closest(".task-item");
    deleteTask(Number(item.dataset.id), item);
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearDoneBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  renderTasks();
});

renderTasks();
