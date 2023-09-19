import * as mongoose from 'mongoose';

export const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

OrganizationSchema.index({ name: 1 }, { unique: true });
