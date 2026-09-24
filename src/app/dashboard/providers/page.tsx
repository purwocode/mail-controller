'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Plus, Edit2, Trash2, Eye, EyeOff, Check, AlertCircle, ShieldCheck, Cloud } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface ProviderConfigItem {
    id: string;
    provider: 'graph' | 'gmail';
    name: string;
    description: string | null;
    graph_tenant_id: string | null;
    graph_client_id: string | null;
    gmail_sender_email: string | null;
    is_default: boolean;
    is_active: boolean;
}

const emptyForm = {
    provider: 'graph' as 'graph' | 'gmail',
    name: '',
    description: '',
    graph_tenant_id: '',
    graph_client_id: '',
    graph_client_secret: '',
    gmail_sender_email: '',
    gmail_service_account_json: '',
    is_default: false,
};

export default function EmailProvidersPage() {
    const [configs, setConfigs] = useState<ProviderConfigItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showSecret, setShowSecret] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadConfigs = async () => {
        setFetching(true);
        setError('');
        try {
            const { data } = await apiFetch<{ data: ProviderConfigItem[] }>('/api/email-providers');
            setConfigs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load email providers');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadConfigs();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setShowSecret(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            if (editingId) {
                const payload: Record<string, unknown> = { ...formData };
                if (!payload.graph_client_secret) delete payload.graph_client_secret;
                if (!payload.gmail_service_account_json) delete payload.gmail_service_account_json;
                await apiFetch(`/api/email-providers/${editingId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
                setMessage('Provider config updated successfully');
            } else {
                await apiFetch('/api/email-providers', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
                setMessage('Provider config added successfully');
            }

            resetForm();
            await loadConfigs();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving provider config');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (config: ProviderConfigItem) => {
        setEditingId(config.id);
        setFormData({
            provider: config.provider,
            name: config.name,
            description: config.description ?? '',
            graph_tenant_id: config.graph_tenant_id ?? '',
            graph_client_id: config.graph_client_id ?? '',
            graph_client_secret: '',
            gmail_sender_email: config.gmail_sender_email ?? '',
            gmail_service_account_json: '',
            is_default: config.is_default,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this provider config?')) return;

        setError('');
        try {
            await apiFetch(`/api/email-providers/${id}`, { method: 'DELETE' });
            setMessage('Provider config deleted');
            await loadConfigs();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting provider config');
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <KeyRound className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Email Providers</h1>
                </div>
                <p className="text-gray-600">Manage Microsoft Graph and Gmail API credentials for sending emails</p>
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
                {showForm ? 'Cancel' : 'Add New Provider'}
            </button>

            {/* Form */}
            {showForm && (
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingId ? 'Edit Provider Config' : 'Add New Provider Config'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Provider Type */}
                        <div className="flex gap-4">
                            {(['graph', 'gmail'] as const).map((p) => (
                                <label
                                    key={p}
                                    className={`flex-1 flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer ${formData.provider === p ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        } ${editingId ? 'opacity-60 pointer-events-none' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="provider"
                                        value={p}
                                        checked={formData.provider === p}
                                        onChange={handleChange}
                                        disabled={!!editingId}
                                        className="w-4 h-4"
                                    />
                                    {p === 'graph' ? (
                                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    ) : (
                                        <Cloud className="w-5 h-5 text-red-500" />
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                        {p === 'graph' ? 'Microsoft Graph (OAuth2)' : 'Gmail API'}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Config Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Config Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Marketing Graph App"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="e.g., Used for cold outreach"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {formData.provider === 'graph' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tenant ID</label>
                                        <input
                                            type="text"
                                            name="graph_tenant_id"
                                            value={formData.graph_tenant_id}
                                            onChange={handleChange}
                                            placeholder="common"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                                        <input
                                            type="text"
                                            name="graph_client_id"
                                            value={formData.graph_client_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Client Secret {editingId && '(leave blank to keep current)'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSecret ? 'text' : 'password'}
                                                name="graph_client_secret"
                                                value={formData.graph_client_secret}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                required={!editingId}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecret(!showSecret)}
                                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                            >
                                                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
                                        <input
                                            type="email"
                                            name="gmail_sender_email"
                                            value={formData.gmail_sender_email}
                                            onChange={handleChange}
                                            placeholder="your-email@example.com"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Account JSON {editingId && '(leave blank to keep current)'}
                                        </label>
                                        <textarea
                                            name="gmail_service_account_json"
                                            value={formData.gmail_service_account_json}
                                            onChange={handleChange}
                                            placeholder="{ ...service account key... }"
                                            required={!editingId}
                                            rows={5}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Default Checkbox */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={formData.is_default}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Set as default {formData.provider === 'graph' ? 'Microsoft Graph' : 'Gmail'} config
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
                        <p className="text-gray-600 text-lg">No email providers configured yet</p>
                        <p className="text-gray-500">Add Microsoft Graph or Gmail API credentials to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Provider</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
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
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="inline-flex items-center gap-1">
                                                {config.provider === 'graph' ? (
                                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Cloud className="w-4 h-4 text-red-500" />
                                                )}
                                                {config.provider === 'graph' ? 'Microsoft Graph' : 'Gmail API'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {config.provider === 'graph' ? config.graph_client_id : config.gmail_sender_email}
                                        </td>
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
