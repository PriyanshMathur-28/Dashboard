import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { User, Profile } from '../types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    login: (token: string, userData: User) => Promise<Profile | null>;
    logout: () => void;
    refreshProfile: () => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async (): Promise<Profile | null> => {
        try {
            const res = await api.get('/profile');
            setProfile(res.data);
            return res.data;
        } catch (error: any) {
            // If there is no profile yet (404), treat it as not completed rather than a hard error
            if (error?.response?.status === 404) {
                setProfile(null);
                return null;
            }
            console.error('Failed to fetch profile', error);
            setProfile(null);
            return null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            runId: 'pre-fix',
                            hypothesisId: 'H7',
                            location: 'src/contexts/AuthContext.tsx:checkAuthStart',
                            message: 'Auth check starting',
                            data: {},
                            timestamp: Date.now(),
                        }),
                    }).catch(() => {});
                    // #endregion
                    const userRes = await api.get('/auth/me');
                    setUser(userRes.data);
                    await refreshProfile();
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            runId: 'pre-fix',
                            hypothesisId: 'H7',
                            location: 'src/contexts/AuthContext.tsx:checkAuthError',
                            message: 'Auth check failed',
                            data: {},
                            timestamp: Date.now(),
                        }),
                    }).catch(() => {});
                    // #endregion
                    localStorage.removeItem('token');
                    setUser(null);
                    setProfile(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (token: string, userData: User): Promise<Profile | null> => {
        localStorage.setItem('token', token);
        setUser(userData);
        const profileData = await refreshProfile();
        return profileData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
