import mongoose from 'mongoose';

const BugLogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    stack: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    endpoint: {
      type: String,
    },
    method: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BugLog', BugLogSchema);