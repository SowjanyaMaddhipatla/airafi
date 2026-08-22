const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Profile = require('../models/Profile');

// @desc  Create a transaction and atomically update Profile totals
// @route POST /api/transactions
const createTransaction = async (req, res, next) => {
  try {
    const { title, type, amount, category, date } = req.body;

    if (!title || !type || !amount || !category) {
      res.status(400);
      throw new Error('title, type, amount, and category are all required');
    }
    if (!['income', 'expense'].includes(type)) {
      res.status(400);
      throw new Error('type must be either "income" or "expense"');
    }

    const numericAmount = Number(amount);

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      type,
      amount: numericAmount,
      category,
      date: date || Date.now(),
    });

    // Atomic $inc — single DB round-trip, no read-modify-write race condition.
    const incFields =
      type === 'income'
        ? { balance: numericAmount, totalIncome: numericAmount }
        : { balance: -numericAmount, totalExpense: numericAmount };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: incFields },
      { new: true }
    );

    res.status(201).json({ success: true, transaction, profile });
  } catch (err) {
    next(err);
  }
};

// @desc  Update a transaction — reverses old $inc, applies new $inc atomically
// @route PUT /api/transactions/:id
const updateTransaction = async (req, res, next) => {
  try {
    const existing = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!existing) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    const { title, type, amount, category, date } = req.body;
    const newType = type || existing.type;
    const newAmount = amount !== undefined ? Number(amount) : existing.amount;

    // Reverse the old contribution, then apply the new one, in one $inc call.
    const reverse =
      existing.type === 'income'
        ? { balance: -existing.amount, totalIncome: -existing.amount }
        : { balance: existing.amount, totalExpense: -existing.amount };

    const apply =
      newType === 'income'
        ? { balance: newAmount, totalIncome: newAmount }
        : { balance: -newAmount, totalExpense: newAmount };

    const combinedInc = {
      balance: reverse.balance + apply.balance,
      totalIncome: (reverse.totalIncome || 0) + (apply.totalIncome || 0),
      totalExpense: (reverse.totalExpense || 0) + (apply.totalExpense || 0),
    };

    existing.title = title ?? existing.title;
    existing.type = newType;
    existing.amount = newAmount;
    existing.category = category ?? existing.category;
    existing.date = date ?? existing.date;
    await existing.save();

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: combinedInc },
      { new: true }
    );

    res.status(200).json({ success: true, transaction: existing, profile });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a transaction and reverse its effect on Profile totals
// @route DELETE /api/transactions/:id
const deleteTransaction = async (req, res, next) => {
  try {
    const existing = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!existing) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    const reverseInc =
      existing.type === 'income'
        ? { balance: -existing.amount, totalIncome: -existing.amount }
        : { balance: existing.amount, totalExpense: -existing.amount };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: reverseInc },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Transaction deleted', profile });
  } catch (err) {
    next(err);
  }
};

// @desc  List transactions with fuzzy search + month/date-range filter
// @route GET /api/transactions?search=milk&month=2026-03&page=1&limit=20
const getTransactions = async (req, res, next) => {
  try {
    const { search, month, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };

    // Fuzzy, case-insensitive keyword search across title & category.
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // "TallyPrime-style" period filtering via dynamic ISO boundaries.
    if (month) {
      // month format: "YYYY-MM"
      const [year, mon] = month.split('-').map(Number);
      const start = new Date(Date.UTC(year, mon - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, mon, 1, 0, 0, 0)); // first day of next month
      query.date = { $gte: start, $lt: end };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const numericLimit = Math.min(Number(limit) || 20, 100);
    const skip = (Number(page) - 1) * numericLimit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(numericLimit),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / numericLimit),
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
};
