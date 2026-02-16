const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const Resume = require('../models/Resume');
const User = require('../models/User');

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select('-password');
        const testResults = await TestResult.find({ user: userId });
        const resumes = await Resume.find({ user: userId });

        // Calculate Readiness Score (Simple Logic)
        const testsTaken = testResults.length;
        const avgScore = testsTaken > 0 ? testResults.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / testsTaken : 0;
        const resumeCreated = resumes.length > 0;

        let score = 0;
        if (resumeCreated) score += 40;
        score += Math.min(60, avgScore * 60); // Scale avg score to max 60 points

        res.json({
            user,
            stats: {
                totalTests: testsTaken,
                resumesCreated: resumes.length,
                readinessScore: Math.round(score)
            },
            recentActivity: testResults.slice(-5)
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
