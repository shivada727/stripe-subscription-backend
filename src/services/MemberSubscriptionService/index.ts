import { ACTIVATION_THRESHOLD, THouseholdKind } from '../../domain/household';
import { resolveFutureMonthlyAnchor } from '../../utils/billing';
import { stripeService } from '../../infrastructure';
import { Household } from '../../models/households';
import { Member } from '../../models/members';

export class MemberSubscriptionService {
    public async subscribe(memberId: string) {
        const member = await Member.findById(memberId);

        if (!member) throw new Error('member_not_found');
        if (!member.stripeCustomerId)
            throw new Error('member_missing_customer');

        const household = await Household.findById(member.householdId).lean();
        if (!household) throw new Error('household_not_found');

        const kind = household.kind as THouseholdKind;
        const threshold = ACTIVATION_THRESHOLD[kind];

        const members = await Member.find({
            householdId: household._id,
        }).lean();

        const flags = await Promise.all(
            members.map(async (member) => {
                if (!member.stripeCustomerId) return false;

                return await stripeService.hasDefaultPaymentMethod(
                    member.stripeCustomerId
                );
            })
        );

        const readyCount = flags.filter(Boolean).length;

        if (readyCount < threshold) throw new Error('activation_blocked');

        const hasPaymentMethod = await stripeService.hasDefaultPaymentMethod(
            member.stripeCustomerId
        );

        if (!hasPaymentMethod) throw new Error('missing_payment_method');

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

    public async cancel(memberId: string) {
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
