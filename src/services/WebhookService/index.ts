import { WebhookEvent } from '../../models/webhooks';
import { Member } from '../../models/members';

export class WebhookService {
    public async markProcessedOrThrow(eventId: string) {
        try {
            await WebhookEvent.create({ _id: eventId });
        } catch {
            const error: any = new Error('event_already_processed');

            error.code = 'event_already_processed';

            throw error;
        }
    }

    private async patchMemberBySubscriptionId(
        subscriptionId: string | undefined,
        patch: Partial<{ status: string }>
    ) {
        if (!subscriptionId) return;

        await Member.updateOne(
            { stripeSubscriptionId: subscriptionId },
            { $set: patch }
        ).exec();
    }

    public async onInvoicePaid(event: any) {
        const inv = event.data.object;

        const subId: string | undefined =
            inv.subscription || inv?.lines?.data?.[0]?.subscription;

        await this.patchMemberBySubscriptionId(subId, { status: 'active' });
    }

    public async onInvoicePaymentFailed(event: any) {
        const inv = event.data.object;

        const subId: string | undefined =
            inv.subscription || inv?.lines?.data?.[0]?.subscription;

        await this.patchMemberBySubscriptionId(subId, { status: 'past_due' });
    }

    public async onSubscriptionDeleted(event: any) {
        const subscribtion = event.data.object;

        await this.patchMemberBySubscriptionId(subscribtion?.id, {
            status: 'canceled',
        });
    }
}
