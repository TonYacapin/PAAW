const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rabiesVaccinationReportRoutes = require('./routes/rabiesVaccinationReport.routes');
const user = require('./routes/userRoutes')
const auth = require('./routes/loginRoute')
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PAAW', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// Use routes
app.use('/', rabiesVaccinationReportRoutes);
app.use('/', user);
app.use('/', auth);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
