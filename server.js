const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Store unique visitors and their information
const visitors = new Map();
let totalVisits = 0;

// Root endpoint (handles http://localhost:3000/)
app.get('/', (req, res) => {
    // Get the IP address from various possible headers
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               req.connection.socket.remoteAddress;
    
    // Get additional information
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();
    
    // Update visitor count
    totalVisits++;
    if (!visitors.has(ip)) {
        visitors.set(ip, {
            firstVisit: timestamp,
            lastVisit: timestamp,
            visits: 1,
            userAgent: userAgent
        });
    } else {
        const visitor = visitors.get(ip);
        visitor.lastVisit = timestamp;
        visitor.visits++;
    }
    
    // Create a more visible log message
    console.log('\n=========================================');
    console.log(`🕒 Time: ${timestamp}`);
    console.log(`🌐 IP Address: ${ip}`);
    console.log(`🖥️ User Agent: ${userAgent}`);
    console.log(`👥 Total Unique Visitors: ${visitors.size}`);
    console.log(`📊 Total Visits: ${totalVisits}`);
    console.log('=========================================\n');
    
    res.send(`
        <html>
            <head>
                <title>IP Logger</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin-top: 50px;
                        background-color: #f0f0f0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .stats {
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>IP Address Logger</h1>
                    <p>Your IP address has been logged</p>
                    <p>IP: ${ip}</p>
                    <div class="stats">
                        <p>Total Unique Visitors: ${visitors.size}</p>
                        <p>Total Visits: ${totalVisits}</p>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// API endpoint to capture and return the client's IP address
app.get('/ip', (req, res) => {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0];
    res.json({ ip: clientIp });
});

// Add a new endpoint to see all visitors
app.get('/visitors', (req, res) => {
    const visitorList = Array.from(visitors.entries()).map(([ip, data]) => ({
        ip,
        firstVisit: data.firstVisit,
        lastVisit: data.lastVisit,
        visits: data.visits,
        userAgent: data.userAgent
    }));
    
    res.json({
        totalVisitors: visitors.size,
        totalVisits: totalVisits,
        visitors: visitorList
    });
});

// Start the server
app.listen(port, () => {
    console.log('\n🚀 Server is running and ready to log IP addresses');
    console.log(`📡 Share this URL to see visitor IPs in the logs`);
    console.log(`📊 Visit /visitors to see all visitor data\n`);
});