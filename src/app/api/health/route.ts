import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
    message: string;
    data?: any;
    error?: string;
};

export async function GET(
    req: Request
): Promise<Response> {
    try {
        return Response.json({
            message: 'Health check OK',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
