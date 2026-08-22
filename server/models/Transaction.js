const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index: isolates a user's records and lets Mongo jump straight
// to a date range (e.g. "March 2026") instead of a full collection scan.
transactionSchema.index({ user: 1, date: -1 });

// Text index for fuzzy/case-insensitive keyword search across title + category.
transactionSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('Transaction', transactionSchema);
