import { Button } from '../../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Download, FileText } from 'lucide-react';

export default function Reports() {
    const reports = [
        { title: 'Monthly Financial Statement', date: 'Feb 2026', size: '1.2 MB', type: 'Statement' },
        { title: 'Tax Summary FY 2025-26', date: 'Jan 2026', size: '2.4 MB', type: 'Tax' },
        { title: 'Credit Score Analysis', date: 'Jan 2026', size: '850 KB', type: 'Credit' },
        { title: 'Loan Eligibility Report', date: 'Dec 2025', size: '1.1 MB', type: 'Loan' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Reports & Documents</h1>
                    <p className="mt-1 text-slate-500 text-sm">Download statements and reports.</p>
                </div>
                <Button className="shrink-0">
                    <Download className="mr-2 h-4 w-4" />
                    Export All Data
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {reports.map((report, i) => (
                    <Card key={i} className="border-slate-200/80 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                            <div className="space-y-1 min-w-0">
                                <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">{report.type}</span>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <span className="truncate">{report.title}</span>
                                </CardTitle>
                                <CardDescription>{report.date} • {report.size}</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="shrink-0">Download</Button>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
