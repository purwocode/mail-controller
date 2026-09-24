'use client';

import { Send, Plus, AlertCircle } from 'lucide-react';

export default function CampaignsPage() {
    const campaigns: any[] = [];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Send className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
                </div>
                <p className="text-gray-600">Create and manage your email campaigns</p>
            </div>

            {/* Add Button */}
            <a
                href="/dashboard/campaigns/new"
                className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
                <Plus className="w-5 h-5" />
                Create New Campaign
            </a>

            {/* Campaigns Grid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {campaigns.length === 0 ? (
                    <div className="p-12 text-center">
                        <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No campaigns created yet</p>
                        <p className="text-gray-500">Create your first campaign to start sending emails</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Campaign Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sent / Total</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                    </table>
                )}
            </div>
        </div>
    );
}
