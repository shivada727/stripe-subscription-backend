export const MEMBER_STATUSES = [
    'pending',
    'active',
    'past_due',
    'paused',
    'canceled',
] as const;
export type TMemberStatus = (typeof MEMBER_STATUSES)[number];

export const MEMBER_ROLES = ['owner', 'member'] as const;
export type TMemberRole = (typeof MEMBER_ROLES)[number];

export function isMemberStatus(candidate: unknown): candidate is TMemberStatus {
    return (
        typeof candidate === 'string' &&
        (MEMBER_STATUSES as readonly string[]).includes(candidate)
    );
}
export function isMemberRole(candidate: unknown): candidate is TMemberRole {
    return (
        typeof candidate === 'string' &&
        (MEMBER_ROLES as readonly string[]).includes(candidate)
    );
}
