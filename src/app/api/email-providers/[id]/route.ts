import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase';
import { encrypt } from '@/lib/crypto';
import {
    isOptionalBoolean,
    isOptionalLongText,
    isShortText,
    isValidEmail,
    parseJsonBody,
    serverErrorResponse,
    MAX_LONG_TEXT,
} from '@/lib/route-helpers';

const SELECT_FIELDS =
    'id, provider, name, description, graph_tenant_id, graph_client_id, gmail_sender_email, is_default, is_active, created_at, updated_at';

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

    const parsed = await parseJsonBody(request);
    if ('error' in parsed) return parsed.error;
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
        is_active,
    } = parsed.body as Record<string, unknown>;

    if (
        (provider !== undefined && provider !== 'graph' && provider !== 'gmail') ||
        (name !== undefined && !isShortText(name)) ||
        !isOptionalLongText(description) ||
        !isOptionalBoolean(is_default) ||
        !isOptionalBoolean(is_active) ||
        (graph_tenant_id !== undefined && !isShortText(graph_tenant_id)) ||
        (graph_client_id !== undefined && !isShortText(graph_client_id)) ||
        (graph_client_secret !== undefined &&
            (typeof graph_client_secret !== 'string' || graph_client_secret.length > MAX_LONG_TEXT)) ||
        (gmail_sender_email !== undefined && !isValidEmail(gmail_sender_email)) ||
        (gmail_service_account_json !== undefined &&
            (typeof gmail_service_account_json !== 'string' || gmail_service_account_json.length > MAX_LONG_TEXT))
    ) {
        return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
    }

    if (gmail_service_account_json) {
        try {
            JSON.parse(gmail_service_account_json);
        } catch {
            return NextResponse.json({ error: 'Gmail service account JSON is invalid' }, { status: 400 });
        }
    }

    try {
        if (is_default && provider) {
            await supabase
                .from('email_provider_configs')
                .update({ is_default: false })
                .eq('user_id', user.id)
                .eq('provider', provider);
        }

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (is_default !== undefined) updates.is_default = is_default;
        if (is_active !== undefined) updates.is_active = is_active;
        if (graph_tenant_id !== undefined) updates.graph_tenant_id = graph_tenant_id;
        if (graph_client_id !== undefined) updates.graph_client_id = graph_client_id;
        if (graph_client_secret) updates.graph_client_secret = encrypt(graph_client_secret as string);
        if (gmail_sender_email !== undefined) updates.gmail_sender_email = gmail_sender_email;
        if (gmail_service_account_json) updates.gmail_service_account_json = encrypt(gmail_service_account_json as string);

        const { data, error } = await supabase
            .from('email_provider_configs')
            .update(updates)
            .eq('id', id)
            .select(SELECT_FIELDS);

        if (error) {
            return serverErrorResponse('PATCH /api/email-providers/[id]', error);
        }
        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ data: data[0] });
    } catch (error) {
        return serverErrorResponse('PATCH /api/email-providers/[id]', error);
    }
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
        .from('email_provider_configs')
        .delete({ count: 'exact' })
        .eq('id', id);

    if (error) {
        return serverErrorResponse('DELETE /api/email-providers/[id]', error);
    }
    if (!count) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
