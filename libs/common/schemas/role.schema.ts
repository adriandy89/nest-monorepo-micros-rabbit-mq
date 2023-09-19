import { PERMISSIONS } from '@app/libs/common/constants/module-access.constants';
import { ORGANIZATION } from '@app/libs/common/models/db.model';
import { Schema, Types } from 'mongoose';

export const RoleSchema = new Schema(
  {
    name: { type: String, required: true },
    organization: {
      type: Types.ObjectId,
      ref: ORGANIZATION.name,
      required: true,
    },
    permissions: {
      administration: {
        type: [String],
        enum: PERMISSIONS,
        required: false,
      },
      products: {
        type: [String],
        enum: PERMISSIONS,
        required: false,
      },
    },
  },
  { timestamps: true },
);

RoleSchema.index({ name: 1 }, { unique: true });
