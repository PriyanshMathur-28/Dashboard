import { useAuth } from '../../contexts/AuthContext';
import { FinancialOverviewChart } from '../../components/charts/FinancialChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { BadgeCheck, CreditCard, DollarSign, TrendingUp, Bell, ChevronRight, User, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Overview() {
    const { profile } = useAuth();
    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };
    const firstName = profile?.full_name?.split(' ')[0] || 'there';

    const stats = [
        { label: 'Total Balance', value: '₹ 12,45,231', sub: '+12.4% from last month', icon: DollarSign, trend: 'up', color: 'emerald' },
        { label: 'Trust Score', value: '780', sub: 'Excellent', icon: BadgeCheck, trend: 'neutral', color: 'emerald' },
        { label: 'Monthly Income', value: '₹ 84,000', sub: '+4% from last month', icon: TrendingUp, trend: 'up', color: 'emerald' },
        { label: 'Active Loans', value: '2', sub: '₹ 1,20,000 remaining', icon: CreditCard, trend: 'neutral', color: 'slate' },
    ];

    const activities = [
        { name: 'Netflix Subscription', amount: '-₹ 599', date: 'Today, 10:00 AM', icon: 'N', type: 'debit' },
        { name: 'Salary Deposit', amount: '+₹ 84,200', date: 'Yesterday, 9:00 AM', icon: 'S', type: 'credit' },
        { name: 'Grocery Store', amount: '-₹ 2,450', date: 'Yesterday, 6:30 PM', icon: 'G', type: 'debit' },
        { name: 'Electric Bill', amount: '-₹ 1,850', date: 'Feb 10, 2:00 PM', icon: 'E', type: 'debit' },
        { name: 'EMI Deduction', amount: '-₹ 8,200', date: 'Feb 8, 6:00 AM', icon: 'L', type: 'debit' },
    ];

    const alerts = [
        { text: 'Profile 80% complete. Add nominee in Account.', action: 'Complete', href: '/account' },
        { text: 'Loan statement for Feb 2026 is ready.', action: 'View', href: '/reports' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{greeting()}, {firstName}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">Dashboard</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(), 'EEEE, MMM d, yyyy')}
                    </div>
                    <button type="button" className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <Card key={s.label} className="relative overflow-hidden border-slate-200/80 hover:shadow-md transition-shadow">
                            <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5', s.color === 'emerald' ? 'bg-emerald-600' : 'bg-slate-600')} />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">{s.label}</CardTitle>
                                <div className={cn('p-2 rounded-lg', s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600')}>
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    {s.trend === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
                                    {s.trend === 'neutral' && <span className="text-slate-400">—</span>}
                                    {s.sub}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Alerts strip */}
            {alerts.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-800 text-sm">
                        <Bell className="h-4 w-4 shrink-0" />
                        <span>{alerts[0].text}</span>
                    </div>
                    <Link to={alerts[0].href} className="text-sm font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1">
                        {alerts[0].action} <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            )}

            {/* Chart + Activity */}
            <div className="grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <FinancialOverviewChart />
                </div>
                <Card className="lg:col-span-3 border-slate-200/80">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                        <CardDescription>Last 5 transactions this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {activities.map((item, i) => (
                                <div key={i} className="flex items-center py-3 border-b border-slate-100 last:border-0">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-semibold text-slate-600 text-sm">
                                        {item.icon}
                                    </div>
                                    <div className="ml-4 flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.date}</p>
                                    </div>
                                    <span className={cn('ml-3 font-semibold tabular-nums text-sm', item.type === 'credit' ? 'text-emerald-600' : 'text-slate-800')}>
                                        {item.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Link to="/reports" className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 py-2">
                            View all activity <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Quick actions + Profile CTA */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-slate-200/80">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Quick actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Link to="/reports" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                            <CreditCard className="h-4 w-4" /> Reports
                        </Link>
                        <Link to="/account" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                            <User className="h-4 w-4" /> Account
                        </Link>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/80 bg-gradient-to-br from-slate-50 to-white">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Keep your profile complete</p>
                                <p className="text-sm text-slate-500">Update KYC and nominee for seamless services.</p>
                            </div>
                        </div>
                        <Link to="/account" className="shrink-0 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700">
                            Go to Account
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
