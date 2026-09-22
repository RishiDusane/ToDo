const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");
const taskTemplate = document.querySelector("#task-template");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks") || "[]");
let currentFilter = "all";

function saveTasks() {
	localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function visibleTasks() {
	if (currentFilter === "active") {
		return tasks.filter((task) => !task.completed);
	}

	if (currentFilter === "completed") {
		return tasks.filter((task) => task.completed);
	}

	return tasks;
}

function renderTasks() {
	taskList.replaceChildren();

	visibleTasks().forEach((task) => {
		const taskItem = taskTemplate.content.firstElementChild.cloneNode(true);
		const checkbox = taskItem.querySelector(".task-checkbox");
		const taskText = taskItem.querySelector(".task-text");

		taskItem.dataset.id = task.id;
		taskText.textContent = task.text;
		checkbox.checked = task.completed;
		taskItem.classList.toggle("completed", task.completed);
		taskList.append(taskItem);
	});

	const remainingTasks = tasks.filter((task) => !task.completed).length;
	taskCount.textContent = remainingTasks;
	emptyState.hidden = visibleTasks().length > 0;
	emptyState.textContent = tasks.length === 0
		? "No tasks yet. Add one above to get started."
		: `No ${currentFilter} tasks to show.`;
}

function addTask(text) {
	tasks.unshift({
		id: crypto.randomUUID(),
		text,
		completed: false
	});
	saveTasks();
	renderTasks();
}

taskForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const text = taskInput.value.trim();

	if (!text) {
		return;
	}

	addTask(text);
	taskInput.value = "";
	taskInput.focus();
});

taskList.addEventListener("change", (event) => {
	if (!event.target.classList.contains("task-checkbox")) {
		return;
	}

	const taskItem = event.target.closest(".task-item");
	const task = tasks.find((item) => item.id === taskItem.dataset.id);
	task.completed = event.target.checked;
	saveTasks();
	renderTasks();
});

taskList.addEventListener("click", (event) => {
	const taskItem = event.target.closest(".task-item");
	if (!taskItem) {
		return;
	}

	const task = tasks.find((item) => item.id === taskItem.dataset.id);

	if (event.target.classList.contains("delete-button")) {
		tasks = tasks.filter((item) => item.id !== task.id);
	}

	if (event.target.classList.contains("edit-button")) {
		const updatedText = window.prompt("Edit task", task.text)?.trim();
		if (updatedText) {
			task.text = updatedText;
		}
	}

	saveTasks();
	renderTasks();
});

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		currentFilter = button.dataset.filter;
		filterButtons.forEach((filterButton) => {
			filterButton.classList.toggle("active", filterButton === button);
		});
		renderTasks();
	});
});

renderTasks();
