const sqlite3 = require('sqlite3').verbose();

// Path to your SQLite database file
const dbPath = './database.sqlite';

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Function to clear the `sensor_events` table
function clearTable() {
    const query = 'DELETE FROM sensor_events';

    db.run(query, function (err) {
        if (err) {
            console.error('Error clearing table:', err.message);
        } else {
            console.log('All rows cleared from the sensor_events table.');
        }

        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing the database connection:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
}

// Run the clearTable function
clearTable();
