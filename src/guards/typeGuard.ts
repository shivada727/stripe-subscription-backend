import { PlanType, THouseholdKind } from '../domain/household';
import {
    HouseholdError,
    HOUSEHOLD_ERROR_HTTP,
} from '../domain/household/errors';
import {
    MemberPaymentError,
    MEMBER_PAYMENT_ERROR_HTTP,
    MemberSubscriptionError,
    MEMBER_SUBSCRIPTION_ERROR_HTTP,
} from '../domain/members/errors';

const HOUSEHOLD_KIND_SET = new Set<string>(Object.values(PlanType));

export function isHouseholdKind(
    candidate: unknown
): candidate is THouseholdKind {
    return typeof candidate === 'string' && HOUSEHOLD_KIND_SET.has(candidate);
}

export function isHouseholdError(
    candidate: unknown
): candidate is HouseholdError {
    return typeof candidate === 'string' && candidate in HOUSEHOLD_ERROR_HTTP;
}
export function isMemberPaymentError(
    candidate: unknown
): candidate is MemberPaymentError {
    return (
        typeof candidate === 'string' && candidate in MEMBER_PAYMENT_ERROR_HTTP
    );
}
export function isMemberSubscriptionError(
    candidate: unknown
): candidate is MemberSubscriptionError {
    return (
        typeof candidate === 'string' &&
        candidate in MEMBER_SUBSCRIPTION_ERROR_HTTP
    );
}
