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
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }

                    body {
                        background-color: #f0f2f5;
                    }

                    .navbar {
                        background-color: #ffffff;
                        height: 60px;
                        padding: 0 16px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        display: flex;
                        align-items: center;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                    }

                    .logo {
                        color: #1877f2;
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .main-content {
                        max-width: 1200px;
                        margin: 80px auto 0;
                        padding: 20px;
                        display: grid;
                        grid-template-columns: 1fr 2fr 1fr;
                        gap: 20px;
                    }

                    .left-sidebar, .right-sidebar {
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    }

                    .content {
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    }

                    .post {
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    }

                    .post-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                    }

                    .avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background-color: #1877f2;
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                    }

                    .post-content {
                        margin-bottom: 15px;
                    }

                    .stats {
                        background: #f0f2f5;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 15px;
                    }

                    .stat-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                    }

                    .stat-icon {
                        margin-right: 10px;
                        color: #1877f2;
                    }

                    .menu-item {
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        border-radius: 8px;
                        margin-bottom: 5px;
                        cursor: pointer;
                    }

                    .menu-item:hover {
                        background-color: #f0f2f5;
                    }

                    .menu-icon {
                        margin-right: 10px;
                        color: #1877f2;
                    }
                </style>
            </head>
            <body>
                <nav class="navbar">
                    <div class="logo">IP Logger</div>
                </nav>

                <div class="main-content">
                    <div class="left-sidebar">
                        <div class="menu-item">
                            <span class="menu-icon">🏠</span>
                            Home
                        </div>
                        <div class="menu-item">
                            <span class="menu-icon">👥</span>
                            Visitors
                        </div>
                        <div class="menu-item">
                            <span class="menu-icon">📊</span>
                            Statistics
                        </div>
                    </div>

                    <div class="content">
                        <div class="post">
                            <div class="post-header">
                                <div class="avatar">IP</div>
                                <div>
                                    <div style="font-weight: bold;">IP Address Detected</div>
                                    <div style="font-size: 0.8em; color: #65676b;">Just now</div>
                                </div>
                            </div>
                            <div class="post-content">
                                <p>Your IP address has been logged:</p>
                                <p style="font-weight: bold; color: #1877f2;">${ip}</p>
                            </div>
                            <div class="stats">
                                <div class="stat-item">
                                    <span class="stat-icon">👥</span>
                                    Total Unique Visitors: ${visitors.size}
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon">📊</span>
                                    Total Visits: ${totalVisits}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="right-sidebar">
                        <h3>About</h3>
                        <p>This application logs and displays visitor IP addresses in a Facebook-like interface.</p>
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