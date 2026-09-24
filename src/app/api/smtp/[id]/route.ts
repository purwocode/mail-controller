import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase';
import { encrypt } from '@/lib/crypto';

const SELECT_FIELDS =
    'id, name, description, host, port, username, use_tls, is_default, is_active, created_at, updated_at';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { supabase, user } = auth;
    const { id } = await params;

    const body = await request.json();
    const { name, description, host, port, username, password, use_tls, is_default, is_active } = body;

    if (is_default) {
        await supabase.from('smtp_configs').update({ is_default: false }).eq('user_id', user.id);
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (host !== undefined) updates.host = host;
    if (port !== undefined) updates.port = port;
    if (username !== undefined) updates.username = username;
    if (use_tls !== undefined) updates.use_tls = use_tls;
    if (is_default !== undefined) updates.is_default = is_default;
    if (is_active !== undefined) updates.is_active = is_active;
    if (password) updates.password = encrypt(password);

    const { data, error } = await supabase
        .from('smtp_configs')
        .update(updates)
        .eq('id', id)
        .select(SELECT_FIELDS);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.length === 0) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: data[0] });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const { error, count } = await auth.supabase
        .from('smtp_configs')
        .delete({ count: 'exact' })
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!count) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
