import Link from "next/link";
import { Hammer } from "lucide-react";

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <Hammer size={40} className="text-primary-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Coming Soon</h1>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
                We are currently building this feature. Check back later for updates as we expand our neurological diagnostic suite.
            </p>

            <Link
                href="/"
                className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-slate-200 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
