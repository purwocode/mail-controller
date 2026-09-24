import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

// Server-only helpers for encrypting secrets (SMTP passwords, OAuth secrets) before they hit Supabase.
const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
    const secret = process.env.APP_SECRET;
    if (!secret) {
        throw new Error('Missing APP_SECRET environment variable');
    }
    // Derive a fixed 32-byte AES-256 key from APP_SECRET
    return createHash('sha256').update(secret).digest();
}

export function encrypt(plainText: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);
    const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('base64')}.${authTag.toString('base64')}.${ciphertext.toString('base64')}`;
}

export function decrypt(payload: string): string {
    const [ivB64, authTagB64, cipherB64] = payload.split('.');
    if (!ivB64 || !authTagB64 || !cipherB64) {
        throw new Error('Invalid encrypted payload format');
    }
    const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));
    const plainText = Buffer.concat([decipher.update(Buffer.from(cipherB64, 'base64')), decipher.final()]);
    return plainText.toString('utf8');
}
