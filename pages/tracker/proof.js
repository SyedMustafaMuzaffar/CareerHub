import Head from 'next/head';
import JobTrackerLayout from '../../components/JobTrackerLayout';
import { useState, useEffect } from 'react';

export default function TrackerProof() {
    // Local state for proof form since it wasn't fully in main Context in vanilla, 
    // but in main.js it was in AppState.proof. 
    // For simplicity, let's use local state syncing with localStorage directly or add to context if critical.
    // Given the requirement "perfect web interface", let's replicate the functionality.

    // Ideally we should move this to Context if we want global access, 
    // but for this specific page, local effect is fine.

    const [proof, setProof] = useState({
        lovable: '',
        github: '',
        deploy: '',
        shipped: false
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('jobTrackerProof')) || { lovable: '', github: '', deploy: '', shipped: false };
        setProof(saved);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newProof = { ...proof, [name]: value };
        setProof(newProof);
        localStorage.setItem('jobTrackerProof', JSON.stringify(newProof));
        checkShipping(newProof);
    };

    const checkShipping = (p) => {
        const isValidUrl = (s) => s && s.startsWith('http');
        // Simplified check: if all URLs present
        if (isValidUrl(p.lovable) && isValidUrl(p.github) && isValidUrl(p.deploy)) {
            if (!p.shipped) {
                const shippedProof = { ...p, shipped: true };
                setProof(shippedProof);
                localStorage.setItem('jobTrackerProof', JSON.stringify(shippedProof));
            }
        } else {
            if (p.shipped) {
                const unshippedProof = { ...p, shipped: false };
                setProof(unshippedProof);
                localStorage.setItem('jobTrackerProof', JSON.stringify(unshippedProof));
            }
        }
    };

    const handleCopy = () => {
        const text = `
Job Notification Tracker — Final Submission

Lovable Project:
${proof.lovable}

GitHub Repository:
${proof.github}

Live Deployment:
${proof.deploy}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
        `.trim();

        navigator.clipboard.writeText(text);
        alert('Copied to Clipboard!');
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
                <h1>Proof of Work</h1>
                <p>Submit your project details.</p>
            </div>
            <div className="container">
                <div className="card form-grid">
                    <div className="input-group form-full">
                        <label className="input-label">Lovable Project URL</label>
                        <input type="text" name="lovable" className="input-field" value={proof.lovable} onChange={handleChange} placeholder="https://lovable.dev/..." />
                    </div>
                    <div className="input-group form-full">
                        <label className="input-label">GitHub Repository URL</label>
                        <input type="text" name="github" className="input-field" value={proof.github} onChange={handleChange} placeholder="https://github.com/..." />
                    </div>
                    <div className="input-group form-full">
                        <label className="input-label">Deployed URL</label>
                        <input type="text" name="deploy" className="input-field" value={proof.deploy} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <div className="form-full" style={{ marginTop: '20px' }}>
                        <button className="btn btn-primary" onClick={handleCopy} disabled={!proof.shipped}>
                            {proof.shipped ? 'Copy Final Submission' : 'Complete All Fields to Ship'}
                        </button>
                    </div>
                </div>
            </div>
        </JobTrackerLayout>
    )
}
