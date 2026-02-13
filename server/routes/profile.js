const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        phone, dob, gender, marital_status, employment_type, company_name, designation, annual_income,
        pan_number, aadhaar_last4, full_name, email, onboarding_completed,
        address_line1, address_line2, city, state, pincode, country,
        nominee_name, nominee_relation, nominee_contact,
    } = req.body;

    const profileFields = { user: req.user.id, updated_at: Date.now() };
    const optional = [
        'phone', 'dob', 'gender', 'marital_status', 'employment_type', 'company_name', 'designation', 'annual_income',
        'pan_number', 'aadhaar_last4', 'full_name', 'email', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'country',
        'nominee_name', 'nominee_relation', 'nominee_contact',
    ];
    optional.forEach((key) => { if (req.body[key] !== undefined) profileFields[key] = req.body[key]; });
    if (onboarding_completed !== undefined) profileFields.onboarding_completed = onboarding_completed;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
