import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function Account() {
    const { user, profile } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal details and contact info.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-500">Full Name</label>
                            <p className="text-slate-900 font-medium">{profile?.full_name || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">Email</label>
                            <p className="text-slate-900">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">Phone</label>
                            <p className="text-slate-900">{profile?.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">PAN Number</label>
                            <p className="text-slate-900">{profile?.pan_number || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
