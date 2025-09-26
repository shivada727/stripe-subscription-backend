import { statusForHouseholdError } from '../../domain/household/errors';
import { isValidationError } from '../ValidationErrors';
import { isHouseholdError } from '../../guards/typeGuard';
import { HttpStatus } from '../../domain/httpStatuses';
import { AppError } from '../AppError';

export function mapError(error: unknown): AppError {
    const message = String((error as any)?.message ?? error ?? '');

    if (isValidationError(message)) {
        return new AppError(HttpStatus.BAD_REQUEST, message);
    }
    if (isHouseholdError(message)) {
        return new AppError(statusForHouseholdError(message), message);
    }
    return new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'internal_error');
}
