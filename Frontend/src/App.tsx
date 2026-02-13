import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedLayout from './components/ProtectedLayout';
import Overview from './pages/dashboard/Overview';
import ProfileCompletion from './pages/dashboard/ProfileCompletion';
import Reports from './pages/dashboard/Reports';
import Account from './pages/dashboard/Account';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Overview />} />
                        <Route path="/analytics" element={<Navigate to="/dashboard" replace />} /> {/* Placeholder */}
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/complete-profile" element={<ProfileCompletion />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
