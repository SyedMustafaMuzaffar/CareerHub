import { useState } from 'react';
import { FaMagic, FaSpinner } from 'react-icons/fa';

export default function AIAssistant({ type, context, onGenerate }) {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        // Simulate API call delay for UX if mock, or wait for real API
        await onGenerate(type, context);
        setLoading(false);
    };

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="ai-btn flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors border border-purple-200"
            title="Generate with AI"
        >
            {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {loading ? 'Generating...' : 'Enhance with AI'}
        </button>
    );
}
