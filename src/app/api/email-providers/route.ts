import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase';
import { encrypt } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

const SELECT_FIELDS =
    'id, provider, name, description, graph_tenant_id, graph_client_id, gmail_sender_email, is_default, is_active, created_at, updated_at';

export async function GET(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await auth.supabase
        .from('email_provider_configs')
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
    const {
        provider,
        name,
        description,
        graph_tenant_id,
        graph_client_id,
        graph_client_secret,
        gmail_sender_email,
        gmail_service_account_json,
        is_default,
    } = body;

    if (!name || (provider !== 'graph' && provider !== 'gmail')) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
        user_id: user.id,
        provider,
        name,
        description: description ?? null,
        is_default: !!is_default,
    };

    if (provider === 'graph') {
        if (!graph_tenant_id || !graph_client_id || !graph_client_secret) {
            return NextResponse.json({ error: 'Missing Microsoft Graph fields' }, { status: 400 });
        }
        insertData.graph_tenant_id = graph_tenant_id;
        insertData.graph_client_id = graph_client_id;
        insertData.graph_client_secret = encrypt(graph_client_secret);
    } else {
        if (!gmail_sender_email || !gmail_service_account_json) {
            return NextResponse.json({ error: 'Missing Gmail API fields' }, { status: 400 });
        }
        try {
            JSON.parse(gmail_service_account_json);
        } catch {
            return NextResponse.json({ error: 'Gmail service account JSON is invalid' }, { status: 400 });
        }
        insertData.gmail_sender_email = gmail_sender_email;
        insertData.gmail_service_account_json = encrypt(gmail_service_account_json);
    }

    if (is_default) {
        await supabase
            .from('email_provider_configs')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .eq('provider', provider);
    }

    const { data, error } = await supabase
        .from('email_provider_configs')
        .insert(insertData)
        .select(SELECT_FIELDS)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
