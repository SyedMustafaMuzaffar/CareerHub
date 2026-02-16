
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userStr);

        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/dashboard/${user.id}`);
                setData(res.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome back, {data?.user?.username || 'Student'}!</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="card border-l-4 border-primary">
                    <h3 className="text-gray-500 text-sm">Readiness Score</h3>
                    <p className="text-4xl font-bold text-primary">{data?.stats?.readinessScore}/100</p>
                </div>
                <div className="card border-l-4 border-secondary">
                    <h3 className="text-gray-500 text-sm">Tests Taken</h3>
                    <p className="text-4xl font-bold text-secondary">{data?.stats?.totalTests}</p>
                </div>
                <div className="card border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm">Resumes Built</h3>
                    <p className="text-4xl font-bold text-purple-500">{data?.stats?.resumesCreated}</p>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                {data?.recentActivity?.length > 0 ? (
                    <ul>
                        {data.recentActivity.map((act, idx) => (
                            <li key={idx} className="border-b py-2 last:border-0">
                                Completed {act.testType} test with score {act.score}/{act.totalQuestions}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recent activity found.</p>
                )}
            </div>
        </div>
    );
}
