const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testType: { type: String, enum: ['aptitude', 'coding'], required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
