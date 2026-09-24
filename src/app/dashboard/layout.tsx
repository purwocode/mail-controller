import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
