import { NextResponse } from 'next/server';

// Shared input validation + safe-error helpers for API route handlers.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOST_RE = /^[a-zA-Z0-9.-]+$/;

export const MAX_SHORT_TEXT = 255;
export const MAX_LONG_TEXT = 10000;

export function isValidEmail(value: unknown): value is string {
    return typeof value === 'string' && value.length <= MAX_SHORT_TEXT && EMAIL_RE.test(value);
}

export function isValidPort(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 65535;
}

export function isValidHost(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0 && value.length <= MAX_SHORT_TEXT && HOST_RE.test(value);
}

export function isShortText(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_SHORT_TEXT;
}

export function isOptionalLongText(value: unknown): boolean {
    return value === undefined || value === null || (typeof value === 'string' && value.length <= MAX_LONG_TEXT);
}

export function isOptionalBoolean(value: unknown): boolean {
    return value === undefined || typeof value === 'boolean';
}

// Logs the real error server-side only; callers must never forward `error` details to the client
export function serverErrorResponse(context: string, error: unknown) {
    console.error(context, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

// Parses the JSON body without letting a malformed payload throw an uncaught (potentially leaky) error
export async function parseJsonBody<T = Record<string, unknown>>(
    request: Request
): Promise<{ body: T } | { error: NextResponse }> {
    try {
        return { body: (await request.json()) as T };
    } catch {
        return { error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) };
    }
}
