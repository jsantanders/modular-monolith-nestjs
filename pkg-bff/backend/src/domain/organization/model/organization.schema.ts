import { Schema } from 'mongoose';

export const OrganizationSchema = new Schema(
  {
    name: {
      required: true,
      type: Schema.Types.String,
    },
    slug: {
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
    collection: 'organization',
  },
);
