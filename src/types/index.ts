import type { THouseholdKind } from '../domain'; 

export type TMemberStatus = 'pending' | 'active' | 'past_due' | 'paused' | 'canceled';
export type TMemberRole = 'owner' | 'member';

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
  userId?: string;
  status: TMemberStatus;
  role: TMemberRole;
  createdAt: string | Date;
};
