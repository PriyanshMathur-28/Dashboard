const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    email: { type: String, required: true },
    full_name: String,
    phone: String,
    dob: Date,
    gender: String,
    marital_status: String,
    employment_type: String,
    company_name: String,
    designation: String,
    annual_income: String,
    pan_number: String,
    aadhaar_last4: String,
    // Address
    address_line1: String,
    address_line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    // Nominee
    nominee_name: String,
    nominee_relation: String,
    nominee_contact: String,
    onboarding_completed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);
