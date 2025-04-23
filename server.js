const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Root endpoint (handles http://localhost:3000/)
app.get('/', (req, res) => {
    res.send('Welcome to the API! Visit /ip to get your IP address.');
});

// API endpoint to capture and return the client's IP address
app.get('/ip', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.json({ ip: clientIp });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});