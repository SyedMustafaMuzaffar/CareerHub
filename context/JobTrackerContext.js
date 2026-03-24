import { createContext, useContext, useState, useEffect } from 'react';
import { JOBS } from '../data/jobs';

const JobTrackerContext = createContext();

export function JobTrackerProvider({ children }) {
    // State initialization from localStorage or defaults
    const [jobs, setJobs] = useState([]);
    const [saved, setSaved] = useState([]);
    const [status, setStatus] = useState({});
    const [preferences, setPreferences] = useState({});
    const [digest, setDigest] = useState(null);
    const [filters, setFilters] = useState({
        keyword: '',
        location: 'All',
        mode: 'All',
        experience: 'All',
        source: 'All',
        status: 'All',
        sort: 'Latest',
        showOnlyMatches: false
    });

    // Load initial state on client-side mount
    useEffect(() => {
        setJobs(JOBS);
        const savedJobs = JSON.parse(localStorage.getItem('kodnest_saved_jobs')) || [];
        const jobStatus = JSON.parse(localStorage.getItem('jobTrackerStatus')) || {};
        const userPrefs = JSON.parse(localStorage.getItem('jobTrackerPreferences')) || {};

        setSaved(savedJobs);
        setStatus(jobStatus);
        setPreferences(userPrefs);
    }, []);

    // Scoring Engine
    const calculateMatchScore = (job) => {
        if (!preferences || Object.keys(preferences).length === 0) return 0;

        let score = 0;
        const safeSplit = (str) => (str || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);

        const roleKeywords = safeSplit(preferences.roleKeywords);
        const preferredLocations = (preferences.preferredLocations || []);
        const preferredModes = (preferences.preferredMode || []);
        const userSkills = safeSplit(preferences.skills);
        const jobSkills = job.skills.map(s => s.toLowerCase());

        // 1. Role Keywords (+25 Title, +15 Description)
        const titleLower = job.title.toLowerCase();
        if (roleKeywords.some(k => titleLower.includes(k))) score += 25;
        const descLower = job.description.toLowerCase();
        if (roleKeywords.some(k => descLower.includes(k))) score += 15;

        // 2. Location (+15)
        if (preferredLocations.some(loc => job.location.includes(loc))) score += 15;

        // 3. Mode (+10)
        if (preferredModes.includes(job.mode)) score += 10;

        // 4. Experience (+10)
        if (job.experience === preferences.experienceLevel) score += 10;

        // 5. Skills Overlap (+15)
        if (jobSkills.some(s => userSkills.includes(s))) score += 15;

        // 6. Recency (+5)
        if (job.postedDaysAgo <= 2) score += 5;

        // 7. Source (+5)
        if (job.source === 'LinkedIn') score += 5;

        return Math.min(score, 100);
    };

    // Actions
    const toggleSave = (id) => {
        let newSaved;
        if (saved.includes(id)) {
            newSaved = saved.filter(savedId => savedId !== id);
        } else {
            newSaved = [...saved, id];
        }
        setSaved(newSaved);
        localStorage.setItem('kodnest_saved_jobs', JSON.stringify(newSaved));
    };

    const updateStatus = (id, newStatus) => {
        const newStatusObj = {
            ...status,
            [id]: {
                status: newStatus,
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now()
            }
        };
        setStatus(newStatusObj);
        localStorage.setItem('jobTrackerStatus', JSON.stringify(newStatusObj));
    };

    const savePreferences = (newPrefs) => {
        setPreferences(newPrefs);
        localStorage.setItem('jobTrackerPreferences', JSON.stringify(newPrefs));
    };

    const generateDigest = () => {
        if (!preferences || Object.keys(preferences).length === 0) return null;

        const today = new Date().toISOString().split('T')[0];
        const key = `jobTrackerDigest_${today}`;

        // Check cache first (optional, logic from main.js)
        /* 
        const cached = localStorage.getItem(key);
        if (cached) return JSON.parse(cached);
        */

        let candidates = jobs.map(j => ({ ...j, score: calculateMatchScore(j) }))
            .filter(j => j.score > 0);

        // Sort: Score Desc -> postedDaysAgo Asc
        candidates.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.postedDaysAgo - b.postedDaysAgo;
        });

        const top10 = candidates.slice(0, 10);

        const digestData = {
            date: today,
            jobs: top10,
            generatedAt: new Date().toISOString()
        };

        setDigest(digestData);
        localStorage.setItem(key, JSON.stringify(digestData));
        return digestData;
    };

    const loadDigest = () => {
        const today = new Date().toISOString().split('T')[0];
        const key = `jobTrackerDigest_${today}`;
        const cached = localStorage.getItem(key);
        if (cached) {
            setDigest(JSON.parse(cached));
        } else {
            setDigest(null);
        }
    }

    // Filter Logic
    const getFilteredJobs = () => {
        let result = jobs;

        if (filters.keyword) {
            const k = filters.keyword.toLowerCase();
            result = result.filter(j => j.title.toLowerCase().includes(k) || j.company.toLowerCase().includes(k));
        }
        if (filters.location !== 'All') result = result.filter(j => j.location.includes(filters.location) || (filters.location === 'Remote' && j.mode === 'Remote'));
        if (filters.mode !== 'All') result = result.filter(j => j.mode === filters.mode);
        if (filters.experience !== 'All') result = result.filter(j => j.experience === filters.experience);
        if (filters.source !== 'All') result = result.filter(j => j.source === filters.source);

        if (filters.status !== 'All') {
            result = result.filter(j => {
                const s = status[j.id]?.status || 'Not Applied';
                return s === filters.status;
            });
        }

        if (filters.showOnlyMatches) {
            const minScore = parseInt(preferences.minMatchScore) || 40;
            result = result.filter(j => calculateMatchScore(j) >= minScore);
        }

        if (filters.sort === 'Latest') {
            result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        } else if (filters.sort === 'Salary') {
            result.sort((a, b) => b.salaryRange.localeCompare(a.salaryRange));
        } else if (filters.sort === 'Match') {
            result.sort((a, b) => calculateMatchScore(b) - calculateMatchScore(a));
        }

        return result;
    };


    return (
        <JobTrackerContext.Provider value={{
            jobs,
            saved,
            status,
            preferences,
            digest,
            filters,
            setFilters,
            toggleSave,
            updateStatus,
            savePreferences,
            generateDigest,
            loadDigest,
            calculateMatchScore,
            getFilteredJobs
        }}>
            {children}
        </JobTrackerContext.Provider>
    );
}

export function useJobTracker() {
    return useContext(JobTrackerContext);
}
