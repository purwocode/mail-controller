'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Send, FileText, BarChart3, TrendingUp } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface DashboardStats {
    totalCampaigns: number;
    totalEmails: number;
    sentEmails: number;
    templates: number;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalCampaigns: 0,
        totalEmails: 0,
        sentEmails: 0,
        templates: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user) {
                    setUser(user);
                }

                // Fetch stats from database (akan diimplementasikan setelah database setup)
                setStats({
                    totalCampaigns: 0,
                    totalEmails: 0,
                    sentEmails: 0,
                    templates: 0,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Campaigns',
            value: stats.totalCampaigns,
            icon: Send,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Emails',
            value: stats.totalEmails,
            icon: Mail,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Sent Emails',
            value: stats.sentEmails,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Templates',
            value: stats.templates,
            icon: FileText,
            color: 'from-orange-500 to-orange-600',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Welcome back, {user?.email?.split('@')[0] || 'User'}!
                </h1>
                <p className="text-gray-600 mt-2">Here's your email marketing dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                        >
                            <div className={`bg-gradient-to-br ${stat.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/dashboard/campaigns/new"
                        className="flex flex-col items-center justify-center p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition group"
                    >
                        <Send className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition" />
                        <p className="font-medium text-gray-900">Create Campaign</p>
                        <p className="text-sm text-gray-600 mt-1">Start a new email campaign</p>
                    </a>

                    <a
                        href="/dashboard/templates/new"
                        className="flex flex-col items-center justify-center p-6 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition group"
                    >
                        <FileText className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition" />
                        <p className="font-medium text-gray-900">New Template</p>
                        <p className="text-sm text-gray-600 mt-1">Design email template</p>
                    </a>

                    <a
                        href="/dashboard/lists/new"
                        className="flex flex-col items-center justify-center p-6 border-2 border-green-200 rounded-lg hover:bg-green-50 transition group"
                    >
                        <Mail className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition" />
                        <p className="font-medium text-gray-900">Upload List</p>
                        <p className="text-sm text-gray-600 mt-1">Import email addresses</p>
                    </a>
                </div>
            </div>

            {/* Getting Started */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
                <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                            1
                        </span>
                        <span>Configure your SMTP server in Settings</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                            2
                        </span>
                        <span>Create email templates with your branding</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                            3
                        </span>
                        <span>Upload your email lists</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                            4
                        </span>
                        <span>Create and launch your campaigns</span>
                    </li>
                </ol>
            </div>
        </div>
    );
}
