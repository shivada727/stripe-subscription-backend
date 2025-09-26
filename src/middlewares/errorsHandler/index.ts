import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../domain/httpStatuses';
import { mapError } from '../../errors/MapError';
import { AppError } from '../../errors/AppError';

export function errorHandler(
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction
) {
    const appError = error instanceof AppError ? error : mapError(error);

    if (appError.asText) {
        return response.status(appError.status).send(appError.message);
    }

    if (appError.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        console.error('[ERROR]', error);
    }

    return response
        .status(appError.status)
        .json(appError.payload ?? { error: appError.message });
}
