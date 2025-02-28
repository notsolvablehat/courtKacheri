const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files
app.use(express.static('./'));

// Route to read data.json
app.get('/data.json', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading data' });
        }
        res.json(JSON.parse(data));
    });
});

// Route to write to data.json
app.post('/data.json', (req, res) => {
    const data = JSON.stringify(req.body, null, 4);
    fs.writeFile('data.json', data, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing data' });
        }
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});