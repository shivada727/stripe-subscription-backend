import { THouseholdKind } from './index';

export interface ICreateHouseholdInput {
    kind: THouseholdKind;
    address: string;
    postalCode: string;
    anchorAt?: number;
}

export interface IHouseholdPublic {
    id: string;
    kind: THouseholdKind;
    capacity: number;
    postalCode: string;
    anchorAt: number;
    createdAt: string | Date; 
}

export interface IJoinHouseholdInput {
    address: string;
    postalCode: string;
    userId?: string;
}
