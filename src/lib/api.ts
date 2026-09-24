import { getCurrentSession } from './auth';

// Client-side fetch helper that attaches the current Supabase session as a Bearer token
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const session = await getCurrentSession();
    const token = session?.access_token;

    const res = await fetch(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(json.error || `Request failed (${res.status})`);
    }

    return json as T;
}
