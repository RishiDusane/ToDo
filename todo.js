const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const scheduleInput = document.querySelector("#schedule-input");
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
	const filteredTasks = currentFilter === "active"
		? tasks.filter((task) => !task.completed)
		: currentFilter === "completed"
			? tasks.filter((task) => task.completed)
			: tasks;

	return filteredTasks.sort((firstTask, secondTask) => {
		if (!firstTask.schedule) {
			return 1;
		}
		if (!secondTask.schedule) {
			return -1;
		}
		return new Date(firstTask.schedule) - new Date(secondTask.schedule);
	});
}

function formatSchedule(schedule) {
	if (!schedule) {
		return "No schedule set";
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(new Date(schedule));
}

function renderTasks() {
	taskList.replaceChildren();

	visibleTasks().forEach((task) => {
		const taskItem = taskTemplate.content.firstElementChild.cloneNode(true);
		const checkbox = taskItem.querySelector(".task-checkbox");
		const taskText = taskItem.querySelector(".task-text");
		const taskSchedule = taskItem.querySelector(".task-schedule");

		taskItem.dataset.id = task.id;
		taskText.textContent = task.text;
		taskSchedule.textContent = formatSchedule(task.schedule);
		taskSchedule.dateTime = task.schedule || "";
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

function addTask(text, schedule) {
	tasks.unshift({
		id: crypto.randomUUID(),
		text,
		completed: false,
		schedule
	});
	saveTasks();
	renderTasks();
}

taskForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const text = taskInput.value.trim();
	const schedule = scheduleInput.value;

	if (!text) {
		return;
	}

	addTask(text, schedule);
	taskInput.value = "";
	scheduleInput.value = "";
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
