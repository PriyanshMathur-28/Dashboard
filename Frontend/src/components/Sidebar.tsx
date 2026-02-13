import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

export function Sidebar() {
    const { pathname } = useLocation();
    const { logout, profile, user } = useAuth();

    if (profile && !profile.onboarding_completed) {
        return (
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-emerald-700 tracking-tight">FinDash</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Financial Dashboard</p>
                </div>
                <div className="flex-1 px-4 py-6 space-y-2">
                    <div className="p-4 text-sm text-slate-600 bg-amber-50 border border-amber-100 rounded-lg">
                        Complete your profile to access the full dashboard.
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Account', href: '/account', icon: User },
    ];

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Account';

    return (
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-xl font-bold text-emerald-700 tracking-tight">FinDash</h1>
                <p className="text-xs text-slate-500 mt-0.5">Financial Dashboard</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                isActive
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                        >
                            <Icon className="mr-3 h-5 w-5 shrink-0" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
                    <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
