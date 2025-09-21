import { Schema, model } from 'mongoose';

const WebhookEventSchema = new Schema(
    { _id: { type: String, required: true } },
    { timestamps: true }
);

export const WebhookEvent = model('WebhookEvent', WebhookEventSchema);
