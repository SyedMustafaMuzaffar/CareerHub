import { useState } from 'react';
import axios from 'axios';

export default function Prep() {
    const [activeTab, setActiveTab] = useState('aptitude');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    const fetchQuestions = async (type) => {
        setLoading(true);
        setActiveTab(type);
        setScore(null);
        setAnswers({});
        try {
            const res = await axios.get(`http://localhost:5001/api/prep/questions/${type}`);
            setQuestions(res.data);
        } catch (error) {
            // Fallback mock questions
            if (type === 'aptitude') {
                setQuestions([
                    { id: 1, question: "What comes next in sequence: 2, 4, 8, 16...?", options: ["20", "32", "24", "18"], answer: "32" },
                    { id: 2, question: "If a train travels 60km/h, how far in 2 hours?", options: ["100km", "60km", "120km", "180km"], answer: "120km" }
                ]);
            } else {
                setQuestions([
                    { id: 1, question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: "O(log n)" },
                    { id: 2, question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "List", "Tree"], answer: "Stack" }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qId, option) => {
        setAnswers({ ...answers, [qId]: option });
    };

    const handleSubmit = async () => {
        let calculatedScore = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.answer) calculatedScore++;
        });
        setScore(calculatedScore);

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
            try {
                await axios.post('http://localhost:5001/api/prep/submit', {
                    user: user.id,
                    testType: activeTab,
                    score: calculatedScore,
                    totalQuestions: questions.length
                });
            } catch (err) {
                console.error("Failed to submit test result", err);
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Placement Preparation</h1>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => fetchQuestions('aptitude')}
                    className={`px-4 py-2 rounded ${activeTab === 'aptitude' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                >
                    Aptitude
                </button>
                <button
                    onClick={() => fetchQuestions('coding')}
                    className={`px-4 py-2 rounded ${activeTab === 'coding' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                >
                    Coding
                </button>
            </div>

            {loading ? (
                <p>Loading questions...</p>
            ) : (
                <div className="space-y-6">
                    {questions.length === 0 && <p>Select a category to start practicing.</p>}

                    {questions.map((q, idx) => (
                        <div key={q.id} className="card">
                            <h3 className="text-lg font-semibold mb-3">{idx + 1}. {q.question}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {q.options.map(opt => {
                                    let btnClass = "p-2 border rounded text-left ";
                                    if (score !== null) {
                                        if (opt === q.answer) {
                                            btnClass += "bg-green-100 border-green-500 text-green-700";
                                        } else if (answers[q.id] === opt && opt !== q.answer) {
                                            btnClass += "bg-red-100 border-red-500 text-red-700";
                                        } else {
                                            btnClass += "border-gray-200 opacity-50";
                                        }
                                    } else {
                                        btnClass += answers[q.id] === opt ? "border-primary bg-indigo-50" : "border-gray-200 hover:bg-gray-50";
                                    }

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => !score && handleOptionSelect(q.id, opt)}
                                            disabled={score !== null}
                                            className={btnClass}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {questions.length > 0 && !score && (
                        <button onClick={handleSubmit} className="btn-primary w-full md:w-auto">Submit Answers</button>
                    )}

                    {score !== null && (
                        <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-bold text-xl">
                            You scored {score} / {questions.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
