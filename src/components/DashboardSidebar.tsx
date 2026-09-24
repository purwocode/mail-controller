'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { clearAuthCookie } from '@/lib/auth';
import {
    Menu,
    X,
    LogOut,
    BarChart3,
    Mail,
    Settings,
    KeyRound,
    FileText,
    Send,
    Home,
} from 'lucide-react';

export function DashboardSidebar() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Campaigns', href: '/dashboard/campaigns', icon: Send },
        { label: 'Templates', href: '/dashboard/templates', icon: FileText },
        { label: 'Email Lists', href: '/dashboard/lists', icon: Mail },
        { label: 'SMTP Config', href: '/dashboard/smtp', icon: Settings },
        { label: 'Email Providers', href: '/dashboard/providers', icon: KeyRound },
        { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        clearAuthCookie();
        router.push('/auth/login');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 overflow-y-auto transition-transform duration-300 z-40 md:static md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Zero Sender
                    </h1>
                </div>

                {/* Menu Items */}
                <nav className="space-y-3 mb-8">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-200 hover:text-white group"
                            >
                                <Icon className="w-5 h-5 group-hover:text-blue-400" />
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="border-t border-slate-700 my-6" />

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
