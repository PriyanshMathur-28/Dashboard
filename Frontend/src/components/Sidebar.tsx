import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, PieChart, FileText, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

export function Sidebar() {
    const { pathname } = useLocation();
    const { logout, profile } = useAuth();

    // If onboarding not completed, don't show sidebar or show limited
    if (profile && !profile.onboarding_completed) {
        return (
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-emerald-700">FinDash</h1>
                </div>
                <div className="flex-1 px-4 space-y-2">
                    <div className="p-3 text-sm text-slate-500 bg-slate-50 rounded-md">
                        Please complete your profile to access the dashboard.
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>
        )
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/analytics', icon: PieChart },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Account', href: '/account', icon: User },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold text-emerald-700">FinDash</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
