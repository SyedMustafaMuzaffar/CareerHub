import Head from 'next/head';
import { useJobTracker } from '../../context/JobTrackerContext';
import JobTrackerLayout from '../../components/JobTrackerLayout';
import Link from 'next/link';

export default function SavedJobs() {
    const {
        jobs,
        saved,
        toggleSave,
        status,
        updateStatus,
        calculateMatchScore
    } = useJobTracker();

    const savedJobs = jobs.filter(j => saved.includes(j.id));

    const getStatusStyle = (s) => {
        if (s === 'Applied') return { background: '#E3F2FD', color: '#1976D2', borderColor: '#BBDEFB' };
        if (s === 'Rejected') return { background: '#FFEBEE', color: '#D32F2F', borderColor: '#FFCDD2' };
        if (s === 'Selected') return { background: '#E8F5E9', color: '#2E7D32', borderColor: '#C8E6C9' };
        return {};
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
                <h1>Saved Jobs</h1>
                <p>Jobs you have shortlisted for application.</p>
            </div>

            <div className="container">
                {savedJobs.length === 0 ? (
                    <div className="state-card">
                        <h4>No Saved Jobs</h4>
                        <p>You haven't saved any jobs yet. Browse your dashboard to find matches.</p>
                        <Link href="/tracker" className="btn btn-secondary">Go to Dashboard</Link>
                    </div>
                ) : (
                    <div className="card-grid">
                        {savedJobs.map(job => {
                            const score = calculateMatchScore(job);
                            const currentStatus = status[job.id]?.status || 'Not Applied';

                            let badgeClass = 'match-none';
                            if (score >= 80) badgeClass = 'match-high';
                            else if (score >= 60) badgeClass = 'match-med';
                            else if (score >= 40) badgeClass = 'match-low';

                            return (
                                <div key={job.id} className="job-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                        {score > 0 ? (
                                            <div className={`${badgeClass} match-badge`} style={{ marginBottom: 0 }}>
                                                Match: {score}%
                                            </div>
                                        ) : <div></div>}
                                        <select
                                            className="status-select"
                                            value={currentStatus}
                                            onChange={(e) => updateStatus(job.id, e.target.value)}
                                            style={getStatusStyle(currentStatus)}
                                        >
                                            <option value="Not Applied">Not Applied</option>
                                            <option value="Applied">Applied</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Selected">Selected</option>
                                        </select>
                                    </div>

                                    <div className="job-header">
                                        <div>
                                            <div className="job-title">{job.title}</div>
                                            <div className="job-company">{job.company}</div>
                                        </div>
                                        <div className="job-badge">{job.source}</div>
                                    </div>

                                    <div className="job-details">
                                        <span className="job-detail-icon">📍 {job.location} ({job.mode})</span>
                                        <span className="job-detail-icon">💼 {job.experience} Yrs</span>
                                        <span className="job-detail-icon">💰 {job.salaryRange}</span>
                                    </div>

                                    <div className="job-actions">
                                        <button
                                            className="btn btn-secondary btn-sm btn-primary"
                                            onClick={() => toggleSave(job.id)}
                                        >
                                            Unsave
                                        </button>
                                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Apply</a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </JobTrackerLayout>
    );
}
