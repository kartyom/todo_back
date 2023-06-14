const newTodo = document.getElementById("write-name");
const timeInput = document.getElementById("time-input");
const list = document.getElementById("list");
const completed = document.getElementById("footer");

let todoArray = [];

if (localStorage.getItem("todoArray")) {
  todoArray = JSON.parse(localStorage.getItem("todoArray"));
  render();
  updateCompletedCount();
} else {
  fetch("/todoArray")
    .then((resp) => resp.json())
    .then((resp) => {
      todoArray = resp;
      render();
      updateCompletedCount();
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendTodos() {
  fetch("/todoArray", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ todoArray: todoArray }),
  });
}

function onDelete(index) {
  todoArray.splice(index, 1);
  sendTodos();
  updateCompletedCount();
  render();
}

function render() {
  list.innerHTML = "";

  for (let index = 0; index < todoArray.length; index++) {
    const todo = todoArray[index];

    const todoDiv = document.createElement("div");
    todoDiv.className = "todo";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener("click", () => onCheck(index));
    todoDiv.appendChild(checkbox);

    const taskSpan = document.createElement("span");
    taskSpan.className = "task";
    taskSpan.textContent = todo.text;
    todoDiv.appendChild(taskSpan);

    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";
    timestampSpan.textContent = getFormattedTime(todo.timestamp);
    todoDiv.appendChild(timestampSpan);

    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.textContent = "edit";
    editButton.addEventListener("click", () => onEdit(index));
    todoDiv.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "trash";
    deleteButton.textContent = "delete";
    deleteButton.addEventListener("click", () => onDelete(index));
    todoDiv.appendChild(deleteButton);

    list.appendChild(todoDiv);
  }
  sendTodos();
}

function getFormattedTime(timeValue) {
  const [hours, minutes] = timeValue.split(":");
  const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  return formattedTime;
}

function onEnter(event) {
  event.preventDefault();

  if (!newTodo.value || !timeInput.value) return;

  const timestamp = timeInput.value;
  todoArray.push({ text: newTodo.value, isCompleted: false, timestamp });
  newTodo.value = "";
  timeInput.value = "";

  sendTodos();
  render();
}

function onCheck(index) {
  todoArray[index].isCompleted = !todoArray[index].isCompleted;
  updateCompletedCount();

  sendTodos();
}

function updateCompletedCount() {
  const completedCount = todoArray.filter((todo) => todo.isCompleted).length;
  completed.textContent = "Completed: " + completedCount;
}

document.getElementById("form").addEventListener("submit", onEnter);
