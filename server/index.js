const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API route example
app.get('/api', (req, res) => {
  res.send({ message: 'Hello from the server!' });
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
