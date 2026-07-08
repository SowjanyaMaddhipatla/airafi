const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Step 2 Onboarding Fields
    fullName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    
    // ⚡ THE HYBRID CACHE METRICS (Updated instantly via $inc)
    balance: {
        type: Number,
        default: 0.00
    },
    totalIncome: {
        type: Number,
        default: 0.00
    },
    totalExpense: {
        type: Number,
        default: 0.00
    },
    currency: {
        type: String,
        default: 'INR'
    },
    
    // Application States
    isProfileComplete: {
        type: Boolean,
        default: false // Set to true once Step 2 is finished
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);