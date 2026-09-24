'use client';

import { BarChart3, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                </div>
                <p className="text-gray-600">Campaign performance and email statistics</p>
            </div>

            {/* Coming Soon */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 p-12 text-center">
                <TrendingUp className="w-16 h-16 text-orange-400 mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h2>
                <p className="text-gray-600 mb-4">
                    We're building comprehensive analytics dashboard to track your campaign performance,
                    open rates, click-through rates, and more.
                </p>
                <p className="text-sm text-gray-500">
                    In the meantime, you can track campaign progress in the Campaigns section.
                </p>
            </div>

            {/* Sample Chart Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Sent Trend</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        Chart will appear here
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Rate</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        Chart will appear here
                    </div>
                </div>
            </div>
        </div>
    );
}
