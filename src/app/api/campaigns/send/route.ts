import { createServiceRoleClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { campaign_id } = await request.json();

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
