const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    // Hybrid Cache Engine — running totals, kept pre-computed so the
    // dashboard is an O(1) read instead of a collection-wide aggregation.
    balance: { type: Number, default: 0 },
    totalIncome: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
