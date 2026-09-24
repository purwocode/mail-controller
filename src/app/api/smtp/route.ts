import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase';
import { encrypt } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

const SELECT_FIELDS =
    'id, name, description, host, port, username, use_tls, is_default, is_active, created_at, updated_at';

export async function GET(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await auth.supabase
        .from('smtp_configs')
        .select(SELECT_FIELDS)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { supabase, user } = auth;

    const body = await request.json();
    const { name, description, host, port, username, password, use_tls, is_default } = body;

    if (!name || !host || !port || !username || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (is_default) {
        await supabase.from('smtp_configs').update({ is_default: false }).eq('user_id', user.id);
    }

    const { data, error } = await supabase
        .from('smtp_configs')
        .insert({
            user_id: user.id,
            name,
            description: description ?? null,
            host,
            port,
            username,
            password: encrypt(password),
            use_tls: use_tls ?? true,
            is_default: !!is_default,
        })
        .select(SELECT_FIELDS)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
