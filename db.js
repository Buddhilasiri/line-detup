const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to SQLite:', err.message);
  } else {
    console.log('Connected to SQLite');
    db.run(`
      CREATE TABLE IF NOT EXISTS sensor_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_tag TEXT,
        detection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// Function to log data to CSV
const logToCSV = (sensorTag, message) => {
  const logPath = path.join(__dirname, 'logs', 'sensor_logs.csv');
  const timestamp = new Date().toISOString();

  if (!fs.existsSync(path.join(__dirname, 'logs'))) {
    fs.mkdirSync(path.join(__dirname, 'logs'));
  }

  const logEntry = `${timestamp}, ${sensorTag}, ${message}\n`;
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('Error writing to CSV:', err.message);
  });
};

module.exports = { db, logToCSV };
