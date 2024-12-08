require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, logToCSV } = require('./db');
require('./serial_listner'); // Initialize serial communication

const app = express();
const port = 5005;

// Middleware
app.use(cors({
    origin: '*', // Allow requests from any origin
}));
app.use(express.json());

// Serve static files from the `public` directory
app.use(express.static(path.join(__dirname, 'public')));

// Backend Routes

// Sensor event endpoint
app.post('/sensor_event', (req, res) => {
    const { sensor_tag: sensorTag, message } = req.body;

    if (!['A', 'B', 'C'].includes(sensorTag)) {
        return res.status(400).json({ error: 'Invalid sensor tag' });
    }

    const query = 'INSERT INTO sensor_events (sensor_tag) VALUES (?)';
    db.run(query, [sensorTag], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        logToCSV(sensorTag, message);
        res.status(200).json({ status: 'success', sensor: sensorTag });
    });
});

// Latest event endpoint
app.get('/latest_event', (req, res) => {
    const query = 'SELECT sensor_tag, detection_time FROM sensor_events ORDER BY detection_time DESC LIMIT 1';
    db.get(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'No events found' });
        }
    });
});

// Today's detection count endpoint
app.get('/detection_count', (req, res) => {
    const query = `SELECT COUNT(*) AS count FROM sensor_events WHERE DATE(detection_time) = DATE('now')`;
    db.get(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ count: result.count });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
