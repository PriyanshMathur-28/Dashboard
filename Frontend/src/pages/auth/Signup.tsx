import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { UserPlus } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
    const [code, setCode] = useState('');
    const [twofaToken, setTwofaToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    runId: 'pre-fix',
                    hypothesisId: 'H5',
                    location: 'src/pages/auth/Signup.tsx:handleSignupStart',
                    message: 'Signup submit clicked',
                    data: { email },
                    timestamp: Date.now(),
                }),
            }).catch(() => {});
            // #endregion

            if (step === 'credentials') {
                const res = await api.post('/auth/signup-initial', { email, password });
                setTwofaToken(res.data.twofaToken);
                setStep('2fa');
            } else {
                if (!twofaToken) {
                    setError('Missing 2FA session. Please try signing up again.');
                    setStep('credentials');
                    return;
                }
                const res = await api.post('/auth/signup-verify-2fa', { code, twofaToken });
                const profile = await login(res.data.token, res.data.user);
                // New accounts will not have a profile yet, so send them to the completion flow first.
                if (!profile || !profile.onboarding_completed) {
                    navigate('/complete-profile');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err: any) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    runId: 'pre-fix',
                    hypothesisId: 'H5',
                    location: 'src/pages/auth/Signup.tsx:handleSignupError',
                    message: 'Signup error in frontend',
                    data: {
                        hasResponse: !!err?.response,
                        status: err?.response?.status ?? null,
                    },
                    timestamp: Date.now(),
                }),
            }).catch(() => {});
            // #endregion
            setError(err.response?.data?.msg || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <UserPlus className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                        {step === 'credentials' ? (
                            <>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </>
                        ) : (
                            <>
                                <div className="text-sm text-slate-600">
                                    Step 2 of 2: Enter 2FA code. For this demo, use code <span className="font-mono font-semibold">123456</span>.
                                </div>
                                <Input
                                    type="text"
                                    placeholder="123456"
                                    label="2FA Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" isLoading={loading}>
                            {step === 'credentials' ? 'Continue' : 'Verify 2FA & Sign Up'}
                        </Button>
                        {step === '2fa' && (
                            <button
                                type="button"
                                className="text-sm text-slate-500 hover:underline"
                                onClick={() => {
                                    setStep('credentials');
                                    setTwofaToken(null);
                                    setCode('');
                                }}
                            >
                                Back to email & password
                            </button>
                        )}
                        <div className="text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-emerald-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
