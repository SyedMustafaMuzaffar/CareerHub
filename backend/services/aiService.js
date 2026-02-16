const OpenAI = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (apiKey) {
    openai = new OpenAI({ apiKey });
} else {
    console.warn("OPENAI_API_KEY not found. Using Mock AI Service.");
}

const generateContent = async (type, context) => {
    // FALLBACK: If no key, return mock data immediately
    if (!openai) {
        return mockGenerate(type, context);
    }

    try {
        let prompt = '';
        if (type === 'summary') {
            prompt = `Write a professional 2-3 sentence resume summary for a ${context.jobTitle} with these skills: ${context.skills}.`;
        } else if (type === 'experience') {
            prompt = `Rewrite and enhance this job description for a resume, using action verbs and professional tone: "${context.description}". Role: ${context.title} at ${context.company}.`;
        } else if (type === 'skills') {
            prompt = `Suggest 5-10 technical skills (comma separated) for a ${context.jobTitle}.`;
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI Error:", error);
        return mockGenerate(type, context); // Fallback on error
    }
};

const mockGenerate = (type, context) => {
    if (type === 'summary') {
        return `Driven ${context.jobTitle || 'Professional'} with expertise in ${context.skills || 'modern technologies'}. Proven track record of delivering high-quality solutions and optimizing performance. Eager to contribute to team success.`;
    } else if (type === 'experience') {
        return `• Spearheaded the development of key features for ${context.company || 'the project'}.\n• Collaborated with cross-functional teams to ensure timely delivery.\n• Optimized code performance, reducing load times by 20%.`;
    } else if (type === 'skills') {
        return "JavaScript, React, Node.js, Python, SQL, Git, problem-solving, teamwork";
    }
    return "Content generated.";
};

module.exports = { generateContent };
