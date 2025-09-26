export enum MemberStatus {
  Pending  = 'pending',
  Active   = 'active',
  PastDue  = 'past_due',
  Paused   = 'paused',
  Canceled = 'canceled',
}

export enum MemberRole {
  Owner  = 'owner',
  Member = 'member',
}

export type TMemberStatus = MemberStatus;
export type TMemberRole   = MemberRole;

export const MEMBER_STATUSES: TMemberStatus[] = Object.values(MemberStatus);
export const MEMBER_ROLES: TMemberRole[]     = Object.values(MemberRole);


