import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, [router.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const isActive = (path) => router.pathname === path ? 'text-secondary font-bold' : 'text-gray-300 hover:text-white';

    return (
        <nav className="bg-dark p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    Placement <span className="text-primary">Hub</span>
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link href="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                    <Link href="/prep" className={isActive('/prep')}>Placement Prep</Link>
                    <Link href="/resume" className={isActive('/resume')}>Resume Builder</Link>
                    <Link href="/tracker" className={isActive('/tracker')}>Job Tracker</Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="text-gray-300 hover:text-white">Logout</button>
                    ) : (
                        <Link href="/login" className={isActive('/login')}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
