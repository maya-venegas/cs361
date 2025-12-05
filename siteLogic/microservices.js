const output = document.getElementById("serviceOutput");

// Display JSON nicely
function show(data) {
    output.textContent = JSON.stringify(data, null, 4);
}

/* -------------------- QUOTE -------------------- */
document.getElementById("getQuoteBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/api/quote");
    const data = await res.json();
    show(data);
    console.log("== Sent a request for a quote from quote microservice at /api/quote");
    console.log("Received Response: '", data.author, "' and '", data.quote, "' from quote microservice\n\n");
});

/* -------------------- CREATE USER -------------------- */
document.getElementById("createUserBtn").addEventListener("click", async () => {
    const userData = {
        first_name: "Jane",
        last_name: "Doe",
        email: "jdoe@gmail.com",
        username: "jdoe",
        password: "GoodPassword321!"
    };
    const res = await fetch("http://localhost:5000/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    const data = await res.json();
    show(data);
    console.log("== Sent user data: '", userData, "'to user microservice at /api/create-user");
    console.log("Received Response: '", data.message, "' from user microservice\n\n");
});

/* -------------------- OPT-IN EMAIL -------------------- */
document.getElementById("optInBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/api/opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "jdoe@gmail.com" })
    });
    const data = await res.json();
    show(data);
    console.log("== Sent POST with user data: '", { email: "jdoe@gmail.com" }, "' to user microservice at /api/opt-in");
    console.log("Received Response: '", data.message, "' from notification microservice\n\n");
});

/* -------------------- SESSION TIMER -------------------- */
let sessionInterval = null;
let sessionStart = null;

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

document.getElementById("startSessionBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/session/start", { method: "POST" });
    const data = await res.json();
    if (data.timer_id) startLiveDisplay();
    document.getElementById("timerResult").textContent = JSON.stringify(data, null, 4);
    console.log("== Sent request to start timer to timer microservice at /session/start");
    console.log("Received Response: '", data, "' from timer microservice\n\n");
});

document.getElementById("stopSessionBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/session/stop", { method: "POST" });
    const data = await res.json();
    stopLiveDisplay();
    if (data.duration_ms !== undefined) {
        const ms = data.duration_ms;
        const m = Math.floor(ms / 60000).toString().padStart(2, "0");
        const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        document.getElementById("session-timer").textContent = `${m}:${s}`;
    }
    document.getElementById("timerResult").textContent = JSON.stringify(data, null, 4);
    console.log("== Sent request to stop timer to timer microservice at /session/stop");
    console.log("Received Response: '", data, "' from timer microservice\n\n");
});
