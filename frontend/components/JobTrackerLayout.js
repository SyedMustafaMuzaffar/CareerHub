import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function JobTrackerLayout({ children }) {
    const router = useRouter();

    // Helper to check active link
    const isActive = (path) => router.pathname === path ? 'active-nav-link' : '';

    return (
        <div className="job-tracker-root">
            <Head>
                <title>Job Notification Tracker</title>
                {/* Specific CSS for Job Tracker modules */}
                {/* We load these conditionally or globally? Since Next.js global CSS is restricted, 
                    we might need to rely on the fact that we copied them to public or use a different strategy.
                    Ideally, we should import them in _app.js or here if they are modules. 
                    Structure implies they are plain CSS. 
                    For now, let's assume we can import them in the component or via _app.js if we move them to styles/
                    But standard Next.js CSS import is best. 
                */}
            </Head>

            {/* Injected Styles for this specific module to avoid polluting global scope if possible, 
                or we just rely on specific class names provided by the original CSS 
            */}
            <style jsx global>{`
                /* Import the original CSS files. 
                   Next.js requires global CSS to be in _app.js, OR we can use standard link tags if files are in public/ 
                   Let's assume we moved them to public/styles/job-tracker/ for easier linking without build step issues
                   OR we construct a specific layout that imports them.
                   
                   Given standard Next.js, importing CSS modules is preferred. 
                   But these are legacy CSS files. 
                   The robust way: Import them in this file if configured, or use <link> if in public.
                   
                   Let's use the <link> tag approach if we move files to public/ 
                   I will move frontend/styles/job-tracker to frontend/public/styles/job-tracker 
                   to serve them statically for this "perfect port".
                */
            `}</style>

            {/* We will rely on manual link tags for now as we want to scope it or just load it. 
                Actually, putting them in _app.js is safer for updated Next.js, but these are specific.
                Let's use a wrapper div with a specific class regarding reset? 
                The user wants "perfect integration" visual.
            */}

            <nav className="top-bar">
                <div className="container top-bar-inner">
                    <Link href="/tracker" className="brand">KodNest Job Tracker</Link>

                    <div className="nav-links">
                        <Link href="/tracker" className={`nav-link ${isActive('/tracker')}`}>Dashboard</Link>
                        <Link href="/tracker/saved" className={`nav-link ${isActive('/tracker/saved')}`}>Saved</Link>
                        <Link href="/tracker/digest" className={`nav-link ${isActive('/tracker/digest')}`}>Digest</Link>
                        <Link href="/tracker/settings" className={`nav-link ${isActive('/tracker/settings')}`}>Settings</Link>
                        <Link href="/tracker/proof" className={`nav-link ${isActive('/tracker/proof')}`}>Proof</Link>
                    </div>
                </div>
            </nav>

            <main id="app-content">
                {children}
            </main>
        </div>
    );
}
