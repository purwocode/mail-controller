import { getAuthenticatedUser } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { campaign_id } = await request.json();

        if (typeof campaign_id !== 'string' || !campaign_id) {
            return NextResponse.json({ error: 'Missing campaign_id' }, { status: 400 });
        }

        // TODO: Send emails for campaign
        // This will use the SMTP configuration and template
        // to send emails to the recipients

        return NextResponse.json({
            message: 'Campaign started',
            status: 'running',
        });
    } catch (error) {
        console.error('Send error:', error);
        return NextResponse.json(
            { error: 'Failed to send campaign' },
            { status: 500 }
        );
    }
}
