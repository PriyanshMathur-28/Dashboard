const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const DUMMY_2FA_CODE = '123456';

function generateAuthToken(userId) {
    const payload = {
        user: {
            id: userId,
        },
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });
}

function generateTwoFAToken(userId, flow) {
    const payload = {
        user: {
            id: userId,
        },
        purpose: '2fa',
        flow,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
}

function verifyTwoFAToken(token, expectedFlow) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== '2fa' || decoded.flow !== expectedFlow || !decoded.user?.id) {
            return null;
        }
        return decoded.user.id;
    } catch (err) {
        return null;
    }
}

// =======================
// REGISTER (Signup) - Step 1
// =======================
router.post('/signup-initial', async (req, res) => {
    const { email, password } = req.body;

    try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                runId: 'pre-fix',
                hypothesisId: 'H3',
                location: 'server/routes/auth.js:signupInitial',
                message: 'Signup initial route hit',
                data: { email },
                timestamp: Date.now(),
            }),
        }).catch(() => {});
        // #endregion

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const twofaToken = generateTwoFAToken(user.id, 'signup');

        return res.json({
            requires2FA: true,
            twofaToken,
        });
    } catch (err) {
        console.error(err.message);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                runId: 'pre-fix',
                hypothesisId: 'H3',
                location: 'server/routes/auth.js:signupInitialCatch',
                message: 'Signup initial error',
                data: { error: String(err?.message || err) },
                timestamp: Date.now(),
            }),
        }).catch(() => {});
        // #endregion
        res.status(500).json({ msg: 'Server error' });
    }
});

// =======================
// REGISTER (Signup) - Step 2 (2FA)
// =======================
router.post('/signup-verify-2fa', async (req, res) => {
    const { twofaToken, code } = req.body;

    if (!twofaToken || !code) {
        return res.status(400).json({ msg: 'Missing 2FA token or code' });
    }

    if (code !== DUMMY_2FA_CODE) {
        return res.status(400).json({ msg: 'Invalid 2FA code' });
    }

    const userId = verifyTwoFAToken(twofaToken, 'signup');
    if (!userId) {
        return res.status(400).json({ msg: 'Invalid or expired 2FA token' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const token = generateAuthToken(user.id);

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// =======================
// LOGIN - Step 1
// =======================
router.post('/login-initial', async (req, res) => {
    const { email, password } = req.body;

    try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                runId: 'pre-fix',
                hypothesisId: 'H4',
                location: 'server/routes/auth.js:loginInitial',
                message: 'Login initial route hit',
                data: { email },
                timestamp: Date.now(),
            }),
        }).catch(() => {});
        // #endregion

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const twofaToken = generateTwoFAToken(user.id, 'login');

        return res.json({
            requires2FA: true,
            twofaToken,
        });
    } catch (err) {
        console.error(err.message);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                runId: 'pre-fix',
                hypothesisId: 'H4',
                location: 'server/routes/auth.js:loginInitialCatch',
                message: 'Login initial error',
                data: { error: String(err?.message || err) },
                timestamp: Date.now(),
            }),
        }).catch(() => {});
        // #endregion
        res.status(500).json({ msg: 'Server error' });
    }
});

// =======================
// LOGIN - Step 2 (2FA)
// =======================
router.post('/login-verify-2fa', async (req, res) => {
    const { twofaToken, code } = req.body;

    if (!twofaToken || !code) {
        return res.status(400).json({ msg: 'Missing 2FA token or code' });
    }

    if (code !== DUMMY_2FA_CODE) {
        return res.status(400).json({ msg: 'Invalid 2FA code' });
    }

    const userId = verifyTwoFAToken(twofaToken, 'login');
    if (!userId) {
        return res.status(400).json({ msg: 'Invalid or expired 2FA token' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const token = generateAuthToken(user.id);

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// =======================
// GET CURRENT USER
// =======================
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
