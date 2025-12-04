// Add task user input
var allWords = [];

var taskTitleInput = document.getElementById("new-task-title");
const addTaskButton = document.getElementById("in-progress");

// Get modal elements
const modal = document.getElementById("blank-task-modal");
const cancelModal = document.getElementById("cancel-modal");
const continueModal = document.getElementById("continue-modal");

addTaskButton.addEventListener("click", function () {
    const userInput = taskTitleInput.value.trim();

    if(userInput === "") {
        modal.style.display = "block";
    } else {
        createTask(userInput);
    }
});

cancelModal.addEventListener("click", function () {
    modal.style.display = "none";
});

continueModal.addEventListener("click", function () {
    const userInput = taskTitleInput.value.trim();
    createTask(userInput);
    modal.style.display = "none";
});

function createTask(userInput) {

    // Save to the array
    allWords.push(userInput);

    // Create a new task div    
    var taskDiv = document.createElement("div");
    taskDiv.classList.add("in-progress-task");

    // Create a checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Checkbox event listener
    checkbox.addEventListener("click", function () {
        taskDiv.classList.toggle("completed");
    });

    // Add the user input and checkbox as the task content
    var taskText = document.createElement("span");
    taskText.textContent = userInput;

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);

    // Add task div to the container
    var container = addTaskButton.parentNode;
    container.appendChild(taskDiv);
}