'use client';

import { Mail, Plus, AlertCircle, Download } from 'lucide-react';

export default function EmailListsPage() {
    const lists: any[] = [];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-8 h-8 text-green-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Email Lists</h1>
                </div>
                <p className="text-gray-600">Manage your email recipient lists</p>
            </div>

            {/* Add Button */}
            <a
                href="/dashboard/lists/new"
                className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
                <Plus className="w-5 h-5" />
                Upload New List
            </a>

            {/* Lists Grid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {lists.length === 0 ? (
                    <div className="p-12 text-center">
                        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No email lists yet</p>
                        <p className="text-gray-500">Upload your first email list to get started</p>
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
                            <p className="text-sm text-blue-700">
                                <strong>Supported formats:</strong> CSV, TXT, XLSX
                            </p>
                        </div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">List Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email Count</th>
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
