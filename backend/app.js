const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const userRoutes = require('./routes/user.routes');

const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
 
connectDB();

app.use('/api/users', userRoutes);
// app.use('/api/journals', journalRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Journaling App API!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
