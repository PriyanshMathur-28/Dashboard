import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-slate-50" />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
}
