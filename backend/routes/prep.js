const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');

// Get Questions (Mock Data)
router.get('/questions/:type', (req, res) => {
    const { type } = req.params;

    let questions = [];
    if (type === 'aptitude') {
        questions = [
            { id: 1, question: "What comes next in sequence: 2, 4, 8, 16...?", options: ["20", "32", "24", "18"], answer: "32" },
            { id: 2, question: "If a train travels 60km/h, how far in 2 hours?", options: ["100km", "60km", "120km", "180km"], answer: "120km" },
            { id: 3, question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?", options: ["Granddaughter", "Grandmother", "Daughter", "Aunt"], answer: "Granddaughter" },
            { id: 4, question: "Find the average of first 50 natural numbers.", options: ["12.25", "21.25", "25", "25.5"], answer: "25.5" },
            { id: 5, question: "A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:", options: ["588 apples", "600 apples", "672 apples", "700 apples"], answer: "700 apples" },
            { id: 6, question: "What is 20% of 150?", options: ["30", "25", "20", "35"], answer: "30" },
            { id: 7, question: "If x + y = 10 and x - y = 4, what is x?", options: ["6", "7", "8", "5"], answer: "7" },
            { id: 8, question: "Which number is prime?", options: ["9", "15", "2", "21"], answer: "2" },
            { id: 9, question: "Complete the series: 3, 6, 9, 12, ...", options: ["13", "14", "15", "16"], answer: "15" },
            { id: 10, question: "A car covers 300km in 5 hours. What is its speed?", options: ["50km/h", "60km/h", "70km/h", "40km/h"], answer: "60km/h" },
            { id: 11, question: "If 5 cats catch 5 rats in 5 minutes, how many cats are needed to catch 100 rats in 100 minutes?", options: ["100", "5", "10", "20"], answer: "5" },
            { id: 12, question: "The sum of ages of 5 children born of the intervals of 3 years each is 50 years. What is the age of the youngest child?", options: ["4", "8", "10", "None of these"], answer: "4" },
            { id: 13, question: "A father is aged three times more than his son Ronit. After 8 years, he would be two and a half times of Ronit's age. After further 8 years, how many times would he be of Ronit's age?", options: ["2 times", "2.5 times", "2.75 times", "3 times"], answer: "2 times" },
            { id: 14, question: "What is the probability of getting a sum of 9 from two throws of a dice?", options: ["1/6", "1/8", "1/9", "1/12"], answer: "1/9" },
            { id: 15, question: "Three unbiased coins are tossed. What is the probability of getting at most two heads?", options: ["3/4", "1/4", "3/8", "7/8"], answer: "7/8" },
            { id: 16, question: "If selling price is doubled, the profit triples. Find the profit percent.", options: ["66 2/3", "100", "105 1/3", "120"], answer: "100" },
            { id: 17, question: "A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price of the cycle?", options: ["Rs. 1090", "Rs. 1160", "Rs. 1190", "Rs. 1202"], answer: "Rs. 1190" },
            { id: 18, question: "There are two examinations rooms A and B. If 10 students are sent from A to B, then the number of students in each room is the same. If 20 candidates are sent from B to A, then the number of students in A is double the number of students in B. The number of students in room A is:", options: ["20", "80", "100", "200"], answer: "100" },
            { id: 19, question: "The price of 10 chairs is equal to that of 4 tables. The price of 15 chairs and 2 tables together is Rs. 4000. The total price of 12 chairs and 3 tables is:", options: ["Rs. 3500", "Rs. 3750", "Rs. 3840", "Rs. 3900"], answer: "Rs. 3900" },
            { id: 20, question: "Identify the next number in the series: 10, 18, 28, 40, ...", options: ["50", "52", "54", "56"], answer: "54" },
            { id: 21, question: "If A can do a work in 10 days and B in 15 days, together they do it in?", options: ["6 days", "5 days", "8 days", "7 days"], answer: "6 days" },
            { id: 22, question: "Simple interest on Rs. 2000 for 2 years at 10% per annum?", options: ["Rs. 200", "Rs. 400", "Rs. 500", "Rs. 300"], answer: "Rs. 400" },
            { id: 23, question: "What is the HCF of 12 and 18?", options: ["2", "6", "4", "3"], answer: "6" },
            { id: 24, question: "Ratio of 500m to 2km?", options: ["1:4", "1:2", "1:3", "4:1"], answer: "1:4" },
            { id: 25, question: "Cost price is Rs. 100, Selling price is Rs. 120. Profit %?", options: ["20%", "25%", "15%", "10%"], answer: "20%" },
            { id: 26, question: "Today is Monday. After 61 days, it will be:", options: ["Tuesday", "Saturday", "Friday", "Sunday"], answer: "Saturday" },
            { id: 27, question: "Angle between hands of a clock at 3:00?", options: ["90", "45", "60", "30"], answer: "90" },
            { id: 28, question: "In how many ways can letters of words 'APPLE' be arranged?", options: ["60", "120", "24", "720"], answer: "60" },
            { id: 29, question: "A train 140m long passes a pole in 9 sec. Speed?", options: ["56 km/hr", "60 km/hr", "50 km/hr", "54 km/hr"], answer: "56 km/hr" },
            { id: 30, question: "Which year is a leap year?", options: ["2014", "2016", "2100", "2018"], answer: "2016" }
        ];
    } else if (type === 'coding') {
        questions = [
            { id: 1, question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: "O(log n)" },
            { id: 2, question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "List", "Tree"], answer: "Stack" },
            { id: 3, question: "What does SQL stand for?", options: ["Structured Question List", "Structured Query Language", "Simple Query Language", "System Query Link"], answer: "Structured Query Language" },
            { id: 4, question: "Which of these is NOT a Javascript framework?", options: ["React", "Angular", "Vue", "Laravel"], answer: "Laravel" },
            { id: 5, question: "What is the output of 2 + '2' in JavaScript?", options: ["4", "22", "NaN", "Error"], answer: "22" },
            { id: 6, question: "Which keyword is used to define a variable in Python?", options: ["var", "let", "def", "None of these"], answer: "None of these" },
            { id: 7, question: "What is the extension of a Java class file?", options: [".js", ".class", ".java", ".txt"], answer: ".class" },
            { id: 8, question: "Which symbol is used for single line comments in C++?", options: ["//", "/*", "#", "--"], answer: "//" },
            { id: 9, question: "HTML stands for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"], answer: "Hyper Text Markup Language" },
            { id: 10, question: "Which CSS property changes text color?", options: ["text-color", "color", "font-color", "fg-color"], answer: "color" },
            { id: 11, question: "What is the purpose of 'git init'?", options: ["Commit changes", "Initialize repository", "Push code", "Clone repo"], answer: "Initialize repository" },
            { id: 12, question: "Which method is used to remove the last element from an array in JavaScript?", options: ["shift()", "pop()", "push()", "splice()"], answer: "pop()" },
            { id: 13, question: "What does API stand for?", options: ["Application Programming Interface", "Apple Pie Ingredients", "Advanced Program Integration", "Automated Process Interaction"], answer: "Application Programming Interface" },
            { id: 14, question: "Which HTTP method is used to update data?", options: ["GET", "POST", "PUT", "DELETE"], answer: "PUT" },
            { id: 15, question: "In Python, which data type is immutable?", options: ["List", "Dictionary", "Tuple", "Set"], answer: "Tuple" },
            { id: 16, question: "What is the default port for HTTP?", options: ["21", "80", "443", "8080"], answer: "80" },
            { id: 17, question: "Which command installs Node.js packages?", options: ["node install", "npm install", "install npm", "package install"], answer: "npm install" },
            { id: 18, question: "What is React mainly used for?", options: ["Database Management", "Building User Interfaces", "Server-side logic", "Operating Systems"], answer: "Building User Interfaces" },
            { id: 19, question: "Which language is used for styling web pages?", options: ["HTML", "CSS", "XML", "Java"], answer: "CSS" },
            { id: 20, question: "What does JSON stand for?", options: ["Java Source Object Notation", "JavaScript Object Notation", "Java Standard Output Network", "JavaScript Output Node"], answer: "JavaScript Object Notation" },
            { id: 21, question: "Concept involving wrapping data and methods?", options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], answer: "Encapsulation" },
            { id: 22, question: "Process of organizing data in database?", options: ["Normalization", "Compilation", "Interpretation", "Execution"], answer: "Normalization" },
            { id: 23, question: "Condition where two processes wait for each other?", options: ["Starvation", "Deadlock", "Race Condition", "Timeout"], answer: "Deadlock" },
            { id: 24, question: "Protocol used for secure web browsing?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: "HTTPS" },
            { id: 25, question: "Variable declared inside a function is?", options: ["Global", "Local", "Static", "Extern"], answer: "Local" },
            { id: 26, question: "Which is not a loop structure?", options: ["For", "While", "Do-While", "Repeat-Until"], answer: "Repeat-Until" },
            { id: 27, question: "Symbol for pointer in C?", options: ["&", "*", "->", "#"], answer: "*" },
            { id: 28, question: "CSS Box Model component outside border?", options: ["Padding", "Content", "Margin", "Outline"], answer: "Margin" },
            { id: 29, question: "JavaScript feature to handle async ops?", options: ["Promises", "Loops", "Variables", "Classes"], answer: "Promises" },
            { id: 30, question: "Tag for largest heading in HTML?", options: ["<h6>", "<h1>", "<head>", "<header>"], answer: "<h1>" }
        ];
    }

    // Shuffle and pick 20
    const shuffled = questions.sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 20));
});

// Submit Test Result
router.post('/submit', async (req, res) => {
    try {
        const result = new TestResult(req.body);
        await result.save();
        res.json(result);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
