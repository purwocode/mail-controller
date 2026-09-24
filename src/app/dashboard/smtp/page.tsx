'use client';

import { useEffect, useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface SmtpConfigItem {
    id: string;
    name: string;
    description: string | null;
    host: string;
    port: number;
    username: string;
    use_tls: boolean;
    is_default: boolean;
    is_active: boolean;
}

const emptyForm = {
    name: '',
    description: '',
    host: '',
    port: 587,
    username: '',
    password: '',
    use_tls: true,
    is_default: false,
};

export default function SmtpConfigPage() {
    const [configs, setConfigs] = useState<SmtpConfigItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadConfigs = async () => {
        setFetching(true);
        setError('');
        try {
            const { data } = await apiFetch<{ data: SmtpConfigItem[] }>('/api/smtp');
            setConfigs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load SMTP configs');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadConfigs();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
        });
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setShowPassword(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            if (editingId) {
                const payload: Record<string, unknown> = { ...formData };
                if (!payload.password) delete payload.password;
                await apiFetch(`/api/smtp/${editingId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
                setMessage('SMTP config updated successfully');
            } else {
                await apiFetch('/api/smtp', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
                setMessage('SMTP config added successfully');
            }

            resetForm();
            await loadConfigs();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving SMTP config');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (config: SmtpConfigItem) => {
        setEditingId(config.id);
        setFormData({
            name: config.name,
            description: config.description ?? '',
            host: config.host,
            port: config.port,
            username: config.username,
            password: '',
            use_tls: config.use_tls,
            is_default: config.is_default,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this SMTP config?')) return;

        setError('');
        try {
            await apiFetch(`/api/smtp/${id}`, { method: 'DELETE' });
            setMessage('SMTP config deleted');
            await loadConfigs();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting SMTP config');
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">SMTP Configuration</h1>
                </div>
                <p className="text-gray-600">Manage your SMTP servers and email sending configurations</p>
            </div>

            {/* Message */}
            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-700">{message}</p>
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Add Button */}
            <button
                onClick={() => (showForm ? resetForm() : setShowForm(true))}
                className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
                <Plus className="w-5 h-5" />
                {showForm ? 'Cancel' : 'Add New SMTP Config'}
            </button>

            {/* Form */}
            {showForm && (
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingId ? 'Edit SMTP Config' : 'Add New SMTP Config'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Config Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Config Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Office 365 Account 1"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (optional)
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Marketing team account"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Host */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Host
                                </label>
                                <input
                                    type="text"
                                    name="host"
                                    value={formData.host}
                                    onChange={handleInputChange}
                                    placeholder="e.g., smtp.office365.com"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Port */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Port
                                </label>
                                <input
                                    type="number"
                                    name="port"
                                    value={formData.port}
                                    onChange={handleInputChange}
                                    placeholder="587"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username / Email
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="your-email@example.com"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Password */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password / App Password {editingId && '(leave blank to keep current)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required={!editingId}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Default Checkbox */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={formData.is_default}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Set as default SMTP server
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 font-medium"
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Config' : 'Save Config'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Configs List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {fetching ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : configs.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No SMTP configurations yet</p>
                        <p className="text-gray-500">Add your first SMTP server to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Host</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Port</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {configs.map((config) => (
                                    <tr key={config.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {config.name}
                                            {config.description && (
                                                <p className="text-xs text-gray-500 font-normal">{config.description}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{config.host}</td>
                                        <td className="px-6 py-4 text-gray-600">{config.port}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {config.is_default && (
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                    Default
                                                </span>
                                            )}
                                            {!config.is_active && (
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleEdit(config)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(config.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
