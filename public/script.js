const BASE_URL = 'https://5v76fqwr-5005.asse.devtunnels.ms';

// Declare and initialize lastDetectionTime to null
let lastDetectionTime = null;

// Function to clear the glow effect from all circles
function clearCircles() {
    document.getElementById('circleA').classList.remove('glow');
    document.getElementById('circleB').classList.remove('glow');
    document.getElementById('circleC').classList.remove('glow');
}

// Function to fetch the latest event from the backend and update the dashboard
async function fetchLatestEvent() {
    try {
        const response = await fetch(`${BASE_URL}/latest_event`);
        const data = await response.json();

        // Check if there's a new detection and update if necessary
        if (data.detection_time !== lastDetectionTime) {
            lastDetectionTime = data.detection_time;
            clearCircles();

            // Fetch the detection count
            const detectionCount = await fetchDetectionCount();
            updateDashboard(data, detectionCount);

            // Highlight the corresponding sensor circle
            if (data.sensor_tag === 'A') document.getElementById('circleA').classList.add('glow');
            if (data.sensor_tag === 'B') document.getElementById('circleB').classList.add('glow');
            if (data.sensor_tag === 'C') document.getElementById('circleC').classList.add('glow');
        }
    } catch (error) {
        console.error('Error fetching the latest event:', error);
    }
}

// Function to fetch detection count from the backend
async function fetchDetectionCount() {
    try {
        const response = await fetch(`${BASE_URL}/detection_count`);
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error fetching detection count:', error);
        return 0; // Default to 0 if there's an error
    }
}

// Function to update the dashboard with dynamic data
function updateDashboard(data, detectionCount) {
    // Parse detection time and adjust by adding 10 hours
    let originalTime = new Date(data.detection_time);

    // If the timestamp is invalid, log the issue and exit
    if (isNaN(originalTime)) {
        console.error('Invalid detection time:', data.detection_time);
        return;
    }

    const adjustedTime = new Date(originalTime.getTime() + 7 * 60 * 60 * 1000); // Add 10 hours in milliseconds

    // Format the adjusted time
    const detectionTime = adjustedTime.toLocaleTimeString();

    // Update the dashboard elements
    document.getElementById('detectionCount').innerText = detectionCount;
    document.getElementById('lastDetection').innerText = `Sensor ${data.sensor_tag} at ${detectionTime}`;
}

// Poll the backend every second to get the latest detection event
setInterval(fetchLatestEvent, 1000);
