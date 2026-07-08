const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    title: {
        type: String,
        required: [true, 'Please add a title (e.g., Mother Dairy Milk, Electric Bill)'],
        trim: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'], 
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Groceries', 'Utilities', 'Salary', 'Rent', 'Stock/Inventory', 'Others'],
        default: 'Others'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// 🏎️ CRITICAL PERFORMANCE OPTIMIZATION: Compound Index
// Ensures instant retrieval when querying a user's specific month/year
TransactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);