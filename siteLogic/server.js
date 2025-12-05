const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Store all results
let savedResults = {
    user: null,
    quote: null,
    email: null,
    timer: {
        start: null,
        stop: null
    }
};

let activeTimerId = null;

/* -------------------- USER MICROSERVICE -------------------- */
app.post("/api/create-user", async (req, res) => {
    try {
        console.log("[SERVER] Received POST /api/create-user from frontend. Forwarding to user microservice at :8000/user...");
        const response = await axios.post("http://localhost:8000/user", req.body);
        console.log("[SERVER] Received response from user microservice. Sending back to frontend.");
        savedResults.user = response.data;
        res.json(response.data);
    } catch (err) {
        console.log("[SERVER] Error from user microservice or forwarding. Sending error back to frontend.");
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- QUOTE MICROSERVICE -------------------- */
app.get("/api/quote", async (req, res) => {
    try {
        console.log("[SERVER] Received GET /api/quote from frontend. Forwarding to quote microservice at :7000/quote...");
        const response = await axios.get("http://localhost:7000/quote");
        console.log("[SERVER] Received response from quote microservice. Sending back to frontend.");
        savedResults.quote = response.data;
        res.json(response.data);
    } catch (err) {
        console.log("[SERVER] Error from quote microservice or forwarding. Sending error back to frontend.");
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- EMAIL MICROSERVICE -------------------- */
app.post("/api/opt-in", async (req, res) => {
    try {
        console.log("[SERVER] Received POST /api/opt-in from frontend. Forwarding to notification microservice at :6003/opt-in...");
        const response = await axios.post("http://localhost:6003/opt-in", req.body);
        console.log("[SERVER] Received response from notification microservice. Sending back to frontend.");
        savedResults.email = response.data;
        res.json(response.data);
    } catch (err) {
        console.log("[SERVER] Error from notification microservice or forwarding. Sending error back to frontend.");
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- TIMER MICROSERVICE -------------------- */
app.post("/session/start", async (req, res) => {
    try {
        console.log("[SERVER] Received POST /session/start from frontend. Forwarding to timer microservice at :9000/api/start...");
        const response = await axios.post("http://localhost:9000/api/start", { user_id: 1 });
        console.log("[SERVER] Received response from timer microservice. Sending back to frontend.");
        activeTimerId = response.data.timer_id;
        savedResults.timer.start = response.data;
        res.json(response.data);
    } catch (err) {
        console.log("[SERVER] Error from timer microservice or forwarding. Sending error back to frontend.");
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.post("/session/stop", async (req, res) => {
    try {
        console.log("[SERVER] Received POST /session/stop from frontend. Forwarding to timer microservice at :9000/api/stop...");
        if (!activeTimerId) return res.status(400).json({ error: "No active timer" });
        const response = await axios.post("http://localhost:9000/api/stop", { timer_id: activeTimerId });
        console.log("[SERVER] Received response from timer microservice. Sending back to frontend.");
        activeTimerId = null;
        savedResults.timer.stop = response.data;
        res.json(response.data);
    } catch (err) {
        console.log("[SERVER] Error from timer microservice or forwarding. Sending error back to frontend.");
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- GET ALL RESULTS -------------------- */
app.get("/api/results", (req, res) => {
    res.json(savedResults);
});

app.listen(5000, () => console.log("Tasks and Timers site server running on http://localhost:5000"));
