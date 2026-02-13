import { Button } from '../../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Download, FileText } from 'lucide-react';

export default function Reports() {
    const reports = [
        { title: 'Monthly Financial Statement', date: 'Feb 2026', size: '1.2 MB' },
        { title: 'Tax Summary FY 2025-26', date: 'Jan 2026', size: '2.4 MB' },
        { title: 'Credit Score Analysis', date: 'Jan 2026', size: '850 KB' },
        { title: 'Loan Eligibility Report', date: 'Dec 2025', size: '1.1 MB' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Documents</h1>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export All Data
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {reports.map((report, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-medium flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-emerald-600" />
                                    {report.title}
                                </CardTitle>
                                <CardDescription>{report.date} • {report.size}</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Download</Button>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
