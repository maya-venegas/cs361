//Add task user input

var allWords = [];

var taskTitleInput = document.getElementById("new-task-title");
const addTaskButton = document.getElementById("in-progress");

/*taskTitleInput.addEventListener("change", addTask)*/

addTaskButton.addEventListener("click", addTask);

function addTask(event) {
    console.log("Add task happened: ", event);

    //Create a checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    //Checkbox event listener
    checkbox.addEventListener("click", function () {
        taskDiv.classList.toggle("completed");
    })

    // Get current input value
    var userInput = taskTitleInput.value;

    // Save to the array
    allWords.push(userInput);

    // Create a new task div    
    var taskDiv = document.createElement("div");
    taskDiv.classList.add("in-progress-task");

    // Add the user input and checkbox as the task content
    var taskText = document.createElement("span");
    taskText.textContent = userInput;

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);

    // Add task div to the container
    var container = addTaskButton.parentNode;
    container.appendChild(taskDiv);
}