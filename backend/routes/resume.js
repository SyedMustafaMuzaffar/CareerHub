const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

const { generateContent } = require('../services/aiService');

// Generate Resume Content (AI)
router.post('/generate', async (req, res) => {
    const { type, context } = req.body; // Expecting { type: 'summary'|'experience', context: {...} }

    if (!type || !context) {
        return res.status(400).json({ error: "Missing type or context" });
    }

    try {
        const generatedText = await generateContent(type, context);
        res.json({ generatedContent: generatedText });
    } catch (err) {
        console.error("Generation Error:", err);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

// Create/Save Resume
router.post('/', async (req, res) => {
    try {
        // Assume req.body contains resume data and user ID is passed for now
        const newResume = new Resume(req.body);
        const resume = await newResume.save();
        res.json(resume);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get User Resumes
router.get('/:userId', async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.params.userId });
        res.json(resumes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
