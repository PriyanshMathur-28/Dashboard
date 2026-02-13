import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';

export default function ProfileCompletion() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        phone: '',
        dob: '',
        gender: '',
        employment_type: '',
        pan_number: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        if (name === 'pan_number') {
            value = value.toUpperCase();
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic PAN validation (Simple regex check for format ABCDE1234F)
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(formData.pan_number)) {
            setError('Invalid PAN Number format. Example: ABCDE1234F');
            setLoading(false);
            return;
        }

        try {
            if (!user) throw new Error('No user found');

            await api.post('/profile', {
                phone: formData.phone,
                dob: formData.dob,
                gender: formData.gender,
                employment_type: formData.employment_type,
                pan_number: formData.pan_number,
                full_name: user.full_name || user.email.split('@')[0],
                email: user.email,
                onboarding_completed: true,
            });

            await refreshProfile();
            navigate('/dashboard');
        } catch (err: any) {
            const message =
                err.response?.data?.msg ||
                err.response?.data?.error ||
                err.message ||
                'Failed to update profile';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <CheckCircle2 className="h-6 w-6" />
                        <span className="font-semibold text-sm uppercase tracking-wide">Step 2 of 2</span>
                    </div>
                    <CardTitle className="text-3xl">Complete your profile</CardTitle>
                    <CardDescription className="text-base">
                        Required to unlock Dashboard, Analysis, History and Account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">Gender</label>
                                <select
                                    name="gender"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">Employment Type</label>
                                <select
                                    name="employment_type"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.employment_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Salaried">Salaried</option>
                                    <option value="Self-Employed">Self-Employed</option>
                                    <option value="Student">Student</option>
                                    <option value="Homemaker">Homemaker</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="PAN Number"
                                name="pan_number"
                                placeholder="ABCDE1234F"
                                value={formData.pan_number}
                                onChange={handleChange}
                                maxLength={10}
                                required
                            />
                            <p className="text-xs text-slate-500">Enter PAN in uppercase (example: ABCDE1234F).</p>
                        </div>

                        {/* Document Upload Placeholder */}
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="p-3 bg-emerald-50 rounded-full mb-3">
                                <Upload className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h4 className="font-medium text-slate-900">Upload Documents (Optional)</h4>
                            <p className="text-sm text-slate-500 mb-2">Upload ID proof or Income proof</p>
                            <p className="text-xs text-slate-400">Supports JPG, PNG, PDF up to 5MB</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                                <p>Protected by 256-bit encryption</p>
                            </div>
                            <Button type="submit" size="lg" className="px-8" isLoading={loading}>
                                Save & Unlock Dashboard
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
