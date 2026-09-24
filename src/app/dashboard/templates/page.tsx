'use client';

import { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, AlertCircle } from 'lucide-react';

interface Template {
    id: string;
    name: string;
    subject: string;
    createdAt: string;
}

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [showPreview, setShowPreview] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (confirm('Delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
                </div>
                <p className="text-gray-600">Create and manage your email templates</p>
            </div>

            {/* Add Button */}
            <a
                href="/dashboard/templates/new"
                className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
                <Plus className="w-5 h-5" />
                Create New Template
            </a>

            {/* Templates Grid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {templates.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No templates created yet</p>
                        <p className="text-gray-500">Create your first email template to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Template Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                                        <td className="px-6 py-4 text-gray-600 truncate">{template.subject}</td>
                                        <td className="px-6 py-4 text-gray-600">{template.createdAt}</td>
                                        <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                            <button
                                                onClick={() => setShowPreview(template.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Preview"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <a
                                                href={`/dashboard/templates/${template.id}/edit`}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
