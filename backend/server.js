const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        console.log(`Using In-Memory MongoDB at ${mongoUri}`);

        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected (In-Memory)');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

connectDB();

// Routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const prepRoutes = require('./routes/prep');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/prep', prepRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Placement Hub API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
