import { HOUSEHOLD_KINDS } from '../../domain/household/index';
import { Schema, model } from 'mongoose';

const HouseholdSchema = new Schema(
    {
        kind: { type: String, enum: HOUSEHOLD_KINDS, required: true },
        capacity: { type: Number, required: true },
        addressHash: { type: String, required: true, index: true },
        postalCode: { type: String, required: true },
        priceId: { type: String, required: true },
        anchorAt: { type: Number, required: true },
    },
    { timestamps: true }
);

export const Household = model('Household', HouseholdSchema);
