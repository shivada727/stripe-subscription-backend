import { StripeService } from '../StripeService';
import { Member } from '../../models/members';

const stripeService = new StripeService();

export class MemberPaymentService {
    async createSetupIntent(memberId: string) {
        const member = await Member.findById(memberId);

        if (!member) throw new Error('member_not_found');

        if (!member.stripeCustomerId)
            throw new Error('member_missing_customer');

        const { clientSecret, id } = await stripeService.createSetupIntent(
            member.stripeCustomerId
        );

        return { setupIntentId: id, clientSecret };
    }
}
