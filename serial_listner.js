const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { db, logToCSV } = require('./db');

const port = new SerialPort({
  path: 'COM12', // Replace with your actual COM port
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('Serial port open');
});

parser.on('data', (data) => {
  console.log('Received data:', data);
  // Trim and clean up the data, then extract the sensor tag and message
  const match = data.trim().match(/Received:\s*([A-C]),\s*(DETECTED)/);
  if (match) {
      const sensorTag = match[1];
      const message = match[2];

      const query = 'INSERT INTO sensor_events (sensor_tag) VALUES (?)';
      db.run(query, [sensorTag], function (err) {
          if (err) {
              console.error('Error inserting into SQLite:', err.message);
          } else {
              logToCSV(sensorTag, message);
          }
      });
  } else {
      console.error('Unexpected data format:', data);
  }
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});
