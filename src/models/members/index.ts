import { MEMBER_STATUSES, MEMBER_ROLES } from '../../domain/members';
import { Schema, model } from 'mongoose';

const MemberSchema = new Schema(
    {
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            index: true,
            required: true,
        },
        userId: { type: String, index: true },
        stripeCustomerId: { type: String },
        stripeSubscriptionId: { type: String },
        status: {
            type: String,
            enum: MEMBER_STATUSES,
            default: 'pending',
            required: true,
        },
        role: {
            type: String,
            enum: MEMBER_ROLES,
            default: 'member',
            required: true,
        },
    },
    { timestamps: true }
);

export const Member = model('Member', MemberSchema);
