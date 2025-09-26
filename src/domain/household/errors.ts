import { isHouseholdError } from '../../guards/typeGuard';
import { HttpStatus } from '../httpStatuses';

export enum HouseholdError {
    HouseholdNotFound = 'household_not_found',
    AddressMismatch = 'address_mismatch',
    HouseholdFull = 'household_full',
}

export const HOUSEHOLD_ERROR_HTTP: Record<HouseholdError, HttpStatus> = {
    [HouseholdError.HouseholdNotFound]: HttpStatus.NOT_FOUND,
    [HouseholdError.AddressMismatch]: HttpStatus.FORBIDDEN,
    [HouseholdError.HouseholdFull]: HttpStatus.CONFLICT,
};

export function statusForHouseholdError(error: unknown): HttpStatus {
    return isHouseholdError(error)
        ? HOUSEHOLD_ERROR_HTTP[error]
        : HttpStatus.BAD_REQUEST;
}
