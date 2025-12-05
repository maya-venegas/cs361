const output = document.getElementById("serviceOutput");

// Display JSON nicely
function show(data) {
    output.textContent = JSON.stringify(data, null, 4);
}

/* -------------------- QUOTE -------------------- */
document.getElementById("getQuoteBtn").addEventListener("click", async () => {
    console.log("[FRONTEND] User clicked 'Get Motivational Quote'. Sending request to server at /api/quote...");
    const res = await fetch("http://localhost:5000/api/quote");
    console.log("[FRONTEND] Request sent to server. Awaiting response...");
    const data = await res.json();
    show(data);
    console.log("[FRONTEND] Received response from server. Server forwarded request to quote microservice, got response, and sent it back to frontend.");
    console.log("[FRONTEND] Final quote data: Author: '", data.author, "', Quote: '", data.quote, "'.");
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
    console.log("[FRONTEND] User clicked 'Create New User'. Sending user data to server at /api/create-user...");
    const res = await fetch("http://localhost:5000/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    console.log("[FRONTEND] Request sent to server. Awaiting response...");
    const data = await res.json();
    show(data);
    console.log("[FRONTEND] Received response from server. Server forwarded request to user microservice, got response, and sent it back to frontend.");
    console.log("[FRONTEND] Final user creation response: '", data.message, "'.");
});

/* -------------------- OPT-IN EMAIL -------------------- */
document.getElementById("optInBtn").addEventListener("click", async () => {
    console.log("[FRONTEND] User clicked 'Opt-In to Emails'. Sending email to server at /api/opt-in...");
    const res = await fetch("http://localhost:5000/api/opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "jdoe@gmail.com" })
    });
    console.log("[FRONTEND] Request sent to server. Awaiting response...");
    const data = await res.json();
    show(data);
    console.log("[FRONTEND] Received response from server. Server forwarded request to notification microservice, got response, and sent it back to frontend.");
    console.log("[FRONTEND] Final opt-in response: '", data.message, "'.");
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
    console.log("[FRONTEND] User clicked 'Start Session'. Sending request to server at /session/start...");
    const res = await fetch("http://localhost:5000/session/start", { method: "POST" });
    console.log("[FRONTEND] Request sent to server. Awaiting response...");
    const data = await res.json();
    if (data.timer_id) startLiveDisplay();
    document.getElementById("timerResult").textContent = JSON.stringify(data, null, 4);
    console.log("[FRONTEND] Received response from server. Server forwarded request to timer microservice, got response, and sent it back to frontend.");
    console.log("[FRONTEND] Final timer start response: '", data, "'.");
});

document.getElementById("stopSessionBtn").addEventListener("click", async () => {
    console.log("[FRONTEND] User clicked 'Stop Session'. Sending request to server at /session/stop...");
    const res = await fetch("http://localhost:5000/session/stop", { method: "POST" });
    console.log("[FRONTEND] Request sent to server. Awaiting response...");
    const data = await res.json();
    stopLiveDisplay();
    if (data.duration_ms !== undefined) {
        const ms = data.duration_ms;
        const m = Math.floor(ms / 60000).toString().padStart(2, "0");
        const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        document.getElementById("session-timer").textContent = `${m}:${s}`;
    }
    document.getElementById("timerResult").textContent = JSON.stringify(data, null, 4);
    console.log("[FRONTEND] Received response from server. Server forwarded request to timer microservice, got response, and sent it back to frontend.");
    console.log("[FRONTEND] Final timer stop response: '", data, "'.");
});
