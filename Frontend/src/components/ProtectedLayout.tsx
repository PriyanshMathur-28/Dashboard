import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout() {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is logged in but hasn't completed onboarding (no profile or flag is false),
    // redirect them to the profile completion page unless they are already there.
    if ((!profile || !profile.onboarding_completed) && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50/80 flex">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen p-6 sm:p-8 max-w-[1600px]">
                <Outlet />
            </main>
        </div>
    );
}
