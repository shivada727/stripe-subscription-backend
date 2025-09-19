import type { TMemberStatus, TMemberRole } from '../domain/members';
import type { THouseholdKind } from '../domain/household';

export type CreateHouseholdInput = {
    kind: THouseholdKind;
    address: string;
    postalCode: string;
    anchorAt?: number;
};

export type THouseholdPublic = {
    id: string;
    kind: THouseholdKind;
    capacity: number;
    postalCode: string;
    anchorAt: number;
    createdAt: string | Date;
};

export type TJoinHouseholdInput = {
    address: string;
    postalCode: string;
    userId?: string;
};

export type TMemberPublic = {
    id: string;
    householdId: string;
    userId?: string | null;
    status: TMemberStatus;
    role: TMemberRole;
    createdAt: string | Date;
};
