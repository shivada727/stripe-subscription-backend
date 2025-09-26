import { HttpStatus } from '../httpStatuses';

export enum MemberPaymentError {
    MemberNotFound = 'member_not_found',
    MemberMissingCustomer = 'member_missing_customer',
}

export const MEMBER_PAYMENT_ERROR_HTTP: Record<MemberPaymentError, HttpStatus> =
    {
        [MemberPaymentError.MemberNotFound]: HttpStatus.NOT_FOUND,
        [MemberPaymentError.MemberMissingCustomer]: HttpStatus.CONFLICT,
    };

export function statusForMemberPaymentError(
    error: MemberPaymentError
): HttpStatus {
    return MEMBER_PAYMENT_ERROR_HTTP[error];
}

export enum MemberSubscriptionError {
    MemberNotFound = 'member_not_found',
    MemberMissingCustomer = 'member_missing_customer',
    HouseholdNotFound = 'household_not_found',
    MissingPaymentMethod = 'missing_payment_method',
    MemberNotSubscribed = 'member_not_subscribed',
}

export const MEMBER_SUBSCRIPTION_ERROR_HTTP: Record<
    MemberSubscriptionError,
    HttpStatus
> = {
    [MemberSubscriptionError.MemberNotFound]: HttpStatus.NOT_FOUND,
    [MemberSubscriptionError.HouseholdNotFound]: HttpStatus.NOT_FOUND,
    [MemberSubscriptionError.MemberMissingCustomer]: HttpStatus.CONFLICT,
    [MemberSubscriptionError.MissingPaymentMethod]: HttpStatus.CONFLICT,
    [MemberSubscriptionError.MemberNotSubscribed]: HttpStatus.CONFLICT,
};

export function statusForMemberSubscriptionError(
    err: MemberSubscriptionError
): HttpStatus {
    return MEMBER_SUBSCRIPTION_ERROR_HTTP[err];
}
