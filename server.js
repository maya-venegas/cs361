const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

/* ============================================================= */
/* SAVED RESULTS                                                 */
/* ============================================================= */
let savedResults = {
    user: null,
    quote: null,
    email: null,
    timer: {
        start: null,
        stop: null
    }
};

/* ============================================================= */
/* USER MICROSERVICE                                             */
/* ============================================================= */
app.post("/api/create-user", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:8000/user", req.body);
        savedResults.user = response.data;
        res.json({ success: true, data: response.data });
    } catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* ============================================================= */
/* QUOTE MICROSERVICE                                            */
/* ============================================================= */
app.get("/api/quote", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:7000/quote");
        savedResults.quote = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

/* ============================================================= */
/* EMAIL LISTSERV MICROSERVICE                                   */
/* ============================================================= */
app.post("/api/opt-in", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:6003/opt-in", req.body);
        savedResults.email = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* ============================================================= */
/* TIMER MICROSERVICE                                            */
/* ============================================================= */
app.post("/api/start-timer", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:9000/start", req.body);
        savedResults.timer.start = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

app.post("/api/stop-timer", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:9000/stop", req.body);
        savedResults.timer.stop = response.data;
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
});

/* ============================================================= */
/* LIVE SESSION TIMER (Frontend-connected)                       */
/* ============================================================= */
let activeTimerId = null;

app.post("/session/start", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:9000/start", { user_id: 1 });
        activeTimerId = response.data.timer_id;

        res.json({
            success: true,
            timer_id: activeTimerId
        });
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.post("/session/stop", async (req, res) => {
    try {
        if (!activeTimerId) {
            return res.status(400).json({ error: "No active timer." });
        }

        const response = await axios.post("http://localhost:9000/stop", {
            timer_id: activeTimerId
        });

        const result = response.data;
        activeTimerId = null;

        res.json({
            success: true,
            ...result
        });
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

/* ============================================================= */
/* RESULTS                                                       */
/* ============================================================= */
app.get("/api/results", (req, res) => {
    res.json(savedResults);
});

/* ============================================================= */
/* SINGLE APP.LISTEN (Correct)                                   */
/* ============================================================= */
app.listen(5000, () => {
    console.log("Backend orchestrator running at http://localhost:5000");
});
