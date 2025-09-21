import { resolveFutureMonthlyAnchor } from '../../utils/billing';
import { Household } from '../../models/households';
import { StripeService } from '../StripeService';
import { Member } from '../../models/members';

const stripeService = new StripeService();

export class MemberSubscriptionService {
    async subscribe(memberId: string) {
        const member = await Member.findById(memberId);

        if (!member) throw new Error('member_not_found');

        if (!member.stripeCustomerId)
            throw new Error('member_missing_customer');

        if (
            !(await stripeService.hasDefaultPaymentMethod(
                member.stripeCustomerId
            ))
        ) {
            throw new Error('missing_payment_method');
        }

        if (member.stripeSubscriptionId) {
            return {
                subscriptionId: member.stripeSubscriptionId,
                alreadySubscribed: true,
            };
        }

        const household = await Household.findById(member.householdId).lean();

        if (!household) throw new Error('household_not_found');

        const anchor = resolveFutureMonthlyAnchor(household.anchorAt);

        const subscription = await stripeService.createSubscription({
            customerId: member.stripeCustomerId,
            priceId: household.priceId,
            anchorAt: anchor,
        });

        member.stripeSubscriptionId = subscription.id;

        await member.save();

        return {
            subscriptionId: subscription.id,
            status: subscription.status,
            latestInvoiceId: subscription.latest_invoice as string | undefined,
            paymentIntent:
                (subscription as any).latest_invoice?.payment_intent ??
                undefined,
        };
    }
    async cancel(memberId: string) {
        const member = await Member.findById(memberId);

        if (!member) throw new Error('member_not_found');

        if (!member.stripeSubscriptionId)
            throw new Error('member_not_subscribed');

        const result = await stripeService.cancelSubscriptionAtPeriodEnd(
            member.stripeSubscriptionId
        );

        return {
            subscriptionId: result.id,
            stripeStatus: result.status,
            cancelAt: result.cancelAt,
            currentPeriodEnd: result.currentPeriodEnd,
            willCancelAtPeriodEnd: true,
        };
    }
}
