import crypto from 'node:crypto';

export function normalizeAddress(raw: string): string {
    return (raw || '')
        .toLowerCase()
        .replace(/[.,]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function addressHash(raw: string): string {
    const norm = normalizeAddress(raw);
    
    return crypto.createHash('sha256').update(norm).digest('hex');
}
