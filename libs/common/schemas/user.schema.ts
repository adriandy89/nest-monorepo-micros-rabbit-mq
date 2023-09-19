import { ORGANIZATION, ROLE } from '@app/libs/common/models/db.model';
import { Schema, Types } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, required: false, default: false },
    organization: {
      type: Types.ObjectId,
      ref: ORGANIZATION.name,
      required: true,
    },
    role: { type: Types.ObjectId, ref: ROLE.name, required: true },
  },
  { timestamps: true },
);

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
