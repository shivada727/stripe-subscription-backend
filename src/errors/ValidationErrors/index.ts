const PREFIX_ERRORS = new Set<string>([
    'address is required',
    'postalCode is required',
    'anchorAt must be',
]);

const SUBSTRING_ERRORS = new Set<string>(['kind must be']);

export function isValidationError(message: string): boolean {
    if (!message) return false;

    for (const prefix of PREFIX_ERRORS) {
        if (message.startsWith(prefix)) return true;
    }
    for (const substring of SUBSTRING_ERRORS) {
        if (message.includes(substring)) return true;
    }
    
    return false;
}
