import { getAuthenticatedUser } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { email, list_id, file_content } = await request.json();

        if (typeof list_id !== 'string' || !list_id) {
            return NextResponse.json({ error: 'Missing list_id' }, { status: 400 });
        }

        // TODO: Parse file content and insert emails into database
        // This will handle CSV/TXT/XLSX file uploads

        return NextResponse.json({
            message: 'Emails imported successfully',
            count: 0,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: 'Failed to import emails' },
            { status: 500 }
        );
    }
}
