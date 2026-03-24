import { useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaDownload, FaChevronDown, FaChevronUp, FaMagic } from 'react-icons/fa';
import AIAssistant from '../components/resume/AIAssistant';

export default function ResumeBuilder() {
    const [resumeData, setResumeData] = useState({
        fullName: '',
        email: '',
        phone: '',
        summary: '',
        skills: '',
        jobTitle: '', // For context
        experience: [],
        education: []
    });
    const [loading, setLoading] = useState(false);
    const [expandedSection, setExpandedSection] = useState({
        personal: true,
        experience: true,
        education: false
    });

    const contentRef = useRef();

    const toggleSection = (sec) => {
        setExpandedSection(prev => ({ ...prev, [sec]: !prev[sec] }));
    };

    const handleChange = (e) => {
        setResumeData({ ...resumeData, [e.target.name]: e.target.value });
    };

    // AI Handler
    const handleAIGenerate = async (type, context) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await axios.post(`${API_URL}/api/resume/generate`, {
                type,
                context
            });

            if (res.data.generatedContent) {
                if (type === 'summary') {
                    setResumeData(prev => ({ ...prev, summary: res.data.generatedContent }));
                } else if (type === 'skills') {
                    setResumeData(prev => ({ ...prev, skills: res.data.generatedContent }));
                } else if (type === 'experience') {
                    // Context has index
                    updateExperience(context.index, 'description', res.data.generatedContent);
                }
            }
        } catch (err) {
            console.error("AI Generation Error", err);
            alert("Failed to generate content. Please check backend connection.");
        }
    };

    // Dynamic Field Handlers for Experience
    const addExperience = () => {
        setResumeData({
            ...resumeData,
            experience: [...resumeData.experience, { title: '', company: '', duration: '', description: '' }]
        });
    };

    const updateExperience = (index, field, value) => {
        const newExp = [...resumeData.experience];
        newExp[index][field] = value;
        setResumeData({ ...resumeData, experience: newExp });
    };

    const removeExperience = (index) => {
        const newExp = resumeData.experience.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, experience: newExp });
    };

    // Dynamic Field Handlers for Education
    const addEducation = () => {
        setResumeData({
            ...resumeData,
            education: [...resumeData.education, { degree: '', institution: '', year: '' }]
        });
    };

    const updateEducation = (index, field, value) => {
        const newEdu = [...resumeData.education];
        newEdu[index][field] = value;
        setResumeData({ ...resumeData, education: newEdu });
    };

    const removeEducation = (index) => {
        const newEdu = resumeData.education.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, education: newEdu });
    };

    const handleGenerate = async () => {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                await axios.post(`${API_URL}/api/resume`, {
                    user: user.id,
                    ...resumeData
                });
                alert('Resume Saved Successfully!');
            } catch (err) {
                console.error("Failed to save resume", err);
                alert('Failed to save resume.');
            }
        } else {
            alert('Please login to save your resume.');
        }
        setLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-20 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">

                {/* Editor Section (Hidden on Print) */}
                <div className="print:hidden space-y-6 max-h-[90vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">C.V. Editor</h1>
                        <button onClick={handleGenerate} disabled={loading} className="btn-primary px-6 py-2">
                            {loading ? 'Saving...' : 'Save Resume'}
                        </button>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div
                            className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('personal')}
                        >
                            <h2 className="font-semibold text-gray-700 flex items-center gap-2">👤 Personal Details</h2>
                            {expandedSection.personal ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>

                        {expandedSection.personal && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                <input type="text" name="fullName" placeholder="Full Name" value={resumeData.fullName} onChange={handleChange} className="input-field md:col-span-2" />
                                <input type="text" name="jobTitle" placeholder="Target Job Title (e.g. Frontend Dev)" value={resumeData.jobTitle} onChange={handleChange} className="input-field md:col-span-2 bg-blue-50 border-blue-100" />
                                <input type="email" name="email" placeholder="Email" value={resumeData.email} onChange={handleChange} className="input-field" />
                                <input type="text" name="phone" placeholder="Phone Number" value={resumeData.phone} onChange={handleChange} className="input-field" />

                                <div className="md:col-span-2 space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Professional Summary</label>
                                        <AIAssistant
                                            type="summary"
                                            context={{ jobTitle: resumeData.jobTitle, skills: resumeData.skills }}
                                            onGenerate={handleAIGenerate}
                                        />
                                    </div>
                                    <textarea name="summary" placeholder="Write a compelling summary..." value={resumeData.summary} onChange={handleChange} className="input-field h-32"></textarea>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Skills</label>
                                        <AIAssistant
                                            type="skills"
                                            context={{ jobTitle: resumeData.jobTitle }}
                                            onGenerate={handleAIGenerate}
                                        />
                                    </div>
                                    <input type="text" name="skills" placeholder="Java, React, Node.js, etc." value={resumeData.skills} onChange={handleChange} className="input-field" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Experience Section */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div
                            className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('experience')}
                        >
                            <h2 className="font-semibold text-gray-700 flex items-center gap-2">💼 Experience</h2>
                            {expandedSection.experience ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>

                        {expandedSection.experience && (
                            <div className="p-6 animate-fade-in">
                                {resumeData.experience.map((exp, index) => (
                                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white relative group hover:shadow-md transition-shadow">
                                        <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition">
                                            <FaTrash />
                                        </button>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} className="input-field text-sm font-medium" />
                                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} className="input-field text-sm" />
                                            </div>
                                            <input type="text" placeholder="Duration (e.g. 2020 - Present)" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} className="input-field text-sm" />

                                            <div className="space-y-1">
                                                <div className="flex justify-end">
                                                    <AIAssistant
                                                        type="experience"
                                                        context={{ title: exp.title, company: exp.company, description: exp.description, index }}
                                                        onGenerate={handleAIGenerate}
                                                    />
                                                </div>
                                                <textarea placeholder="Describe your responsibilities and achievements..." value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} className="input-field text-sm h-24"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition flex justify-center items-center gap-2 font-medium">
                                    <FaPlus /> Add Position
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Education Section */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div
                            className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('education')}
                        >
                            <h2 className="font-semibold text-gray-700 flex items-center gap-2">🎓 Education</h2>
                            {expandedSection.education ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>

                        {expandedSection.education && (
                            <div className="p-6 animate-fade-in">
                                {resumeData.education.map((edu, index) => (
                                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white relative group">
                                        <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition">
                                            <FaTrash />
                                        </button>
                                        <div className="grid grid-cols-1 gap-3">
                                            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="input-field text-sm" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="input-field text-sm" />
                                                <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} className="input-field text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition flex justify-center items-center gap-2 font-medium">
                                    <FaPlus /> Add Education
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Section (A4 Page) */}
                <div className="print:w-full print:absolute print:top-0 print:left-0 h-full">
                    <div className="sticky top-8 space-y-4">
                        <div className="flex justify-between items-center mb-4 print:hidden bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800">Live Preview</h2>
                            <button onClick={handlePrint} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center gap-2 text-sm font-medium transition shadow-lg shadow-gray-200">
                                <FaDownload /> Download PDF
                            </button>
                        </div>

                        {/* A4 Page Container */}
                        <div className="bg-white mx-auto shadow-2xl print:shadow-none p-[40px] w-full max-w-[210mm] min-h-[297mm] print:max-w-none text-gray-800 transform-gpu"
                            style={{ fontFamily: 'Merriweather, serif' }}>

                            {/* Modern Minimal Header */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">{resumeData.fullName || 'Your Name'}</h1>
                                <p className="text-lg text-gray-600 mb-4">{resumeData.jobTitle || 'Target Role'}</p>
                                <div className="text-sm text-gray-500 flex flex-wrap gap-4 border-t border-gray-100 pt-4">
                                    {resumeData.email && <span>📧 {resumeData.email}</span>}
                                    {resumeData.phone && <span>📱 {resumeData.phone}</span>}
                                    {/* Add location or LinkedIn if fields exist */}
                                </div>
                            </div>

                            {/* Summary */}
                            {resumeData.summary && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Professional Summary</h3>
                                    <p className="text-sm leading-relaxed text-gray-700 text-justify">{resumeData.summary}</p>
                                </div>
                            )}

                            {/* Experience */}
                            {resumeData.experience.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Work Experience</h3>
                                    <div className="space-y-6">
                                        {resumeData.experience.map((exp, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                                                    <span className="text-sm text-gray-500 font-medium">{exp.duration}</span>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-600 mb-2">{exp.company}</div>
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {resumeData.skills && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Technical Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.split(',').map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full print:bg-white print:border print:border-gray-300">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {resumeData.education.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
                                    <div className="space-y-4">
                                        {resumeData.education.map((edu, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-baseline">
                                                    <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                                                    <span className="text-sm text-gray-500">{edu.year}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">{edu.degree}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for print/preview */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap');
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        background: white;
                    }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:absolute { position: absolute !important; }
                    .print\\:top-0 { top: 0 !important; }
                    .print\\:left-0 { left: 0 !important; }
                    .print\\:max-w-none { max-width: none !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
