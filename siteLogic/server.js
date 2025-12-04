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
        const response = await axios.post("http://localhost:8000/user", req.body);
        savedResults.user = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- QUOTE MICROSERVICE -------------------- */
app.get("/api/quote", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:7000/quote");
        savedResults.quote = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- EMAIL MICROSERVICE -------------------- */
app.post("/api/opt-in", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:6003/opt-in", req.body);
        savedResults.email = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- TIMER MICROSERVICE -------------------- */
app.post("/session/start", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:9000/api/start", { user_id: 1 });
        activeTimerId = response.data.timer_id;
        savedResults.timer.start = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.post("/session/stop", async (req, res) => {
    try {
        if (!activeTimerId) return res.status(400).json({ error: "No active timer" });
        const response = await axios.post("http://localhost:9000/api/stop", { timer_id: activeTimerId });
        activeTimerId = null;
        savedResults.timer.stop = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

/* -------------------- GET ALL RESULTS -------------------- */
app.get("/api/results", (req, res) => {
    res.json(savedResults);
});

app.listen(5000, () => console.log("Tasks and Timers site server running on http://localhost:5000"));
