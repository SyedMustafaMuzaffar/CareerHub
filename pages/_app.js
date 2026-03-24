import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { JobTrackerProvider } from '../context/JobTrackerContext';

function MyApp({ Component, pageProps }) {
    return (
        <JobTrackerProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Component {...pageProps} />
                </main>
                <footer className="bg-dark text-white text-center py-4">
                    <p>&copy; 2026 Placement Hub. All rights reserved.</p>
                </footer>
            </div>
        </JobTrackerProvider>
    )
}

export default MyApp
