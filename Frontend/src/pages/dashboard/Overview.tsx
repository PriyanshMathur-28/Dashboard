import { FinancialOverviewChart } from '../../components/charts/FinancialChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BadgeCheck, CreditCard, DollarSign, TrendingUp } from 'lucide-react';

export default function Overview() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">Last updated: Today, 12:00 PM</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-slate-500">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                        <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">780</div>
                        <p className="text-xs text-slate-500">Excellent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$8,400</div>
                        <p className="text-xs text-slate-500">+4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-slate-500">$12,000 remaining</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <div className="col-span-4">
                    <FinancialOverviewChart />
                </div>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <div className="text-sm text-slate-500">You made 265 transactions this month.</div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                { name: "Netflix Subscription", amount: "-$15.00", date: "Today, 10:00 AM", icon: "N" },
                                { name: "Salary Deposit", amount: "+$4,200.00", date: "Yesterday, 9:00 AM", icon: "S" },
                                { name: "Grocery Store", amount: "-$124.50", date: "Yesterday, 6:30 PM", icon: "G" },
                                { name: "Electric Bill", amount: "-$95.00", date: "Feb 10, 2:00 PM", icon: "E" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                                        {item.icon}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-sm text-slate-500">{item.date}</p>
                                    </div>
                                    <div className={cn("ml-auto font-medium", item.amount.startsWith('+') ? "text-emerald-600" : "text-slate-900")}>
                                        {item.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
import { cn } from '../../lib/utils';
