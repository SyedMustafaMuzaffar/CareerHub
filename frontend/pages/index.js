import Link from 'next/link';

export default function Home() {
    return (
        <div className="text-center py-10">
            <h1 className="text-5xl font-extrabold mb-6">Master Your Career Journey</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                One platform to prepare for placements, build a stellar resume with AI, and track your readiness score.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="card hover:shadow-xl transition transform hover:-translate-y-1">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Placement Prep</h2>
                    <p className="mb-4 text-gray-500">Practice aptitude and coding questions to ace your tests.</p>
                    <Link href="/prep" className="btn-primary block w-full">Start Practice</Link>
                </div>

                <div className="card hover:shadow-xl transition transform hover:-translate-y-1">
                    <h2 className="text-2xl font-bold mb-4 text-secondary">AI Resume Builder</h2>
                    <p className="mb-4 text-gray-500">Generate professional resumes tailored to your profile using AI.</p>
                    <Link href="/resume" className="btn-primary block w-full bg-secondary hover:bg-green-700">Build Resume</Link>
                </div>

                <div className="card hover:shadow-xl transition transform hover:-translate-y-1">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-600">Readiness Dashboard</h2>
                    <p className="mb-4 text-gray-500">Track your progress and see your readiness score evolve.</p>
                    <Link href="/dashboard" className="btn-primary block w-full bg-indigo-600 hover:bg-indigo-800">View Stats</Link>
                </div>
            </div>
        </div>
    )
}
