//Add task user input

var allWords = [];

var taskTitleInput = document.getElementById("new-task-title");
const addTaskButton = document.getElementById("in-progress");

// Get modal elements
const modal = document.getElementById("blank-task-modal");
const cancelModal = document.getElementById("cancel-modal");
const continueModal = document.getElementById("continue-modal");

/*taskTitleInput.addEventListener("change", addTask)*/

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

    //Create a checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    //Checkbox event listener
    checkbox.addEventListener("click", function () {
        taskDiv.classList.toggle("completed");
    })

    // Add the user input and checkbox as the task content
    var taskText = document.createElement("span");
    taskText.textContent = userInput;

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);

    // Add task div to the container
    var container = addTaskButton.parentNode;
    container.appendChild(taskDiv);
}

const output = document.getElementById("serviceOutput");

function show(data) {
    output.textContent = JSON.stringify(data, null, 4);
}

/* --------------------- GET QUOTE ---------------------- */
document.getElementById("getQuoteBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/api/quote");
    show(await res.json());
});

/* --------------------- CREATE USER ---------------------- */
document.getElementById("createUserBtn").addEventListener("click", async () => {
    const userData = {
        first_name: "Jane",
        last_name: "Smith",
        email: "jsmith@test.com",
        username: "jsmith",
        password: "GoodPassword321!"
    };

    const res = await fetch("http://localhost:5000/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    show(await res.json());
});

/* --------------------- OPT IN EMAIL ---------------------- */
document.getElementById("optInBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/api/opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "jsmith@test.com" })
    });

    show(await res.json());
});

//------------------------------------------------------------
// FRONTEND + BACKEND CONNECTED SESSION TIMER
//------------------------------------------------------------

let sessionInterval = null;
let sessionStart = null;

// FRONTEND LIVE TIMER
function startLiveDisplay() {
    sessionStart = Date.now();

    if (sessionInterval) clearInterval(sessionInterval);

    sessionInterval = setInterval(() => {
        const dur = Date.now() - sessionStart;

        const m = Math.floor(dur / 60000).toString().padStart(2, "0");
        const s = Math.floor((dur % 60000) / 1000).toString().padStart(2, "0");

        document.getElementById("session-timer").textContent = `${m}:${s}`;
    }, 1000);
}

function stopLiveDisplay() {
    if (sessionInterval) clearInterval(sessionInterval);
    sessionInterval = null;
}

//------------------------------------------------------------
// API CALLS TO BACKEND
//------------------------------------------------------------

document.getElementById("startSessionBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/session/start", {
        method: "POST"
    });

    const data = await res.json();

    if (data.success) {
        startLiveDisplay();  // <-- frontend counter begins
    }
});

document.getElementById("stopSessionBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/session/stop", {
        method: "POST"
    });

    const data = await res.json();
    stopLiveDisplay();

    // Replace live timer with real microservice time
    if (data.duration_ms !== undefined) {
        const ms = data.duration_ms;

        const m = Math.floor(ms / 60000).toString().padStart(2, "0");
        const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");

        document.getElementById("session-timer").textContent = `${m}:${s}`;
    }

    document.getElementById("timerResult").textContent = 
        JSON.stringify(data, null, 4);
});
