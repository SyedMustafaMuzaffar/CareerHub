import Head from 'next/head';
import { useJobTracker } from '../../context/JobTrackerContext';
import JobTrackerLayout from '../../components/JobTrackerLayout';
import { useState, useEffect } from 'react';

export default function TrackerSettings() {
    const { preferences, savePreferences } = useJobTracker();

    // Local state for form handling
    const [formState, setFormState] = useState({
        roleKeywords: '',
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: '',
        skills: '',
        minMatchScore: 40
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (preferences) {
            setFormState({
                roleKeywords: preferences.roleKeywords || '',
                preferredLocations: preferences.preferredLocations || [],
                preferredMode: preferences.preferredMode || [],
                experienceLevel: preferences.experienceLevel || '',
                skills: preferences.skills || '',
                minMatchScore: preferences.minMatchScore || 40
            });
        }
    }, [preferences]);

    const handleSave = () => {
        savePreferences(formState);
        setMessage('Preferences Saved!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleMultiSelectChange = (e, field) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let newModes = [...formState.preferredMode];
        if (checked) {
            newModes.push(value);
        } else {
            newModes = newModes.filter(m => m !== value);
        }
        setFormState(prev => ({ ...prev, preferredMode: newModes }));
    };

    return (
        <JobTrackerLayout>
            <Head>
                <link rel="stylesheet" href="/styles/job-tracker/reset.css" />
                <link rel="stylesheet" href="/styles/job-tracker/variables.css" />
                <link rel="stylesheet" href="/styles/job-tracker/layout.css" />
                <link rel="stylesheet" href="/styles/job-tracker/components.css" />
            </Head>

            <div className="container context-header">
                <h1>Settings</h1>
                <p>Configure your job tracking preferences.</p>
            </div>

            <div className="container">
                <div className="card form-grid">
                    <div className="input-group form-full">
                        <label className="input-label">Role Keywords (comma separated)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formState.roleKeywords}
                            onChange={(e) => setFormState({ ...formState, roleKeywords: e.target.value })}
                            placeholder="e.g. Frontend, React, SDE"
                        />
                    </div>

                    <div className="input-group form-full">
                        <label className="input-label">Preferred Locations (Cmd+Click to select multiple)</label>
                        <select
                            className="input-field"
                            multiple
                            style={{ height: '120px' }}
                            value={formState.preferredLocations}
                            onChange={(e) => handleMultiSelectChange(e, 'preferredLocations')}
                        >
                            {['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR', 'Chennai', 'Remote'].map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Work Mode</label>
                        <div style={{ display: 'flex', gap: '16px', padding: '10px 0' }}>
                            {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                                <div key={mode} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={`mode-${mode}`}
                                        value={mode}
                                        checked={formState.preferredMode.includes(mode)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`mode-${mode}`}>{mode}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Experience Level</label>
                        <select
                            className="input-field"
                            value={formState.experienceLevel}
                            onChange={(e) => setFormState({ ...formState, experienceLevel: e.target.value })}
                        >
                            <option value="">Select Level</option>
                            {['Fresher', '0-1', '1-3', '3-5', '5+'].map(exp => (
                                <option key={exp} value={exp}>{exp}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group form-full">
                        <label className="input-label">Skills (Key skills for matching)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formState.skills}
                            onChange={(e) => setFormState({ ...formState, skills: e.target.value })}
                            placeholder="e.g. Java, Python, React, AWS"
                        />
                    </div>

                    <div className="input-group form-full">
                        <label className="input-label">Minimum Match Score Threshold: <span>{formState.minMatchScore}</span>%</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formState.minMatchScore}
                            style={{ width: '100%' }}
                            onChange={(e) => setFormState({ ...formState, minMatchScore: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="form-full" style={{ marginTop: '20px' }}>
                        <button className="btn btn-primary" onClick={handleSave}>
                            {message || 'Save Preferences'}
                        </button>
                    </div>
                </div>
            </div>
        </JobTrackerLayout>
    );
}
