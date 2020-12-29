import { Schema } from 'mongoose';

export const ReminderSchema = new Schema(
  {
    title: {
      required: true,
      type: Schema.Types.String,
    },
    complete: {
      required: true,
      type: Schema.Types.Boolean,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'reminder',
  },
);
