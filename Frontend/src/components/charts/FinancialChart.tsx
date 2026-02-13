import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

const data = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
];

export function FinancialOverviewChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Income vs Expenses for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹ ${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                            contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                            formatter={(value: number) => `₹ ${value.toLocaleString('en-IN')}`}
                        />
                        <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="expense" name="Expenses" fill="#64748b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
