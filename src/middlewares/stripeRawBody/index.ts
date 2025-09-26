import { MimeType } from '../../domain/headers';
import { raw } from 'express';

export const stripeRawBody = raw({ type: MimeType.Json });
