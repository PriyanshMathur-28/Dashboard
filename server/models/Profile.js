const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    full_name: String,
    phone: String,
    dob: Date,
    gender: String,
    employment_type: String,
    pan_number: String,
    onboarding_completed: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Profile', profileSchema);
