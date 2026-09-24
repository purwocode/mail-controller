import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client dengan service role
export const createServiceRoleClient = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error('Missing Supabase service role key');
    }
    return createClient(supabaseUrl, serviceRoleKey);
};

// Client scoped to the caller's own JWT so Postgres RLS enforces per-user access (used in Route Handlers)
const createUserScopedClient = (accessToken: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
};

// Validates the `Authorization: Bearer <token>` header from a Route Handler request
export async function getAuthenticatedUser(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (!token) {
        return null;
    }

    const scopedClient = createUserScopedClient(token);
    const { data, error } = await scopedClient.auth.getUser(token);
    if (error || !data.user) {
        return null;
    }

    return { user: data.user, supabase: scopedClient };
}
