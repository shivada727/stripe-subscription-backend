import { TMemberRole, TMemberStatus } from '.';

export interface IMemberPublic {
    id: string;
    householdId: string;
    userId?: string | null;
    status: TMemberStatus;
    role: TMemberRole;
    createdAt: string | Date;
}
