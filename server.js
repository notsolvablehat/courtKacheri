const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;  // ✅ Use Render's assigned port

// Enable CORS for all origins
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve static files

// Handle CORS Preflight Requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

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

// Start server on assigned port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
