import express from 'express';
import { Retailer, Store } from '../db.js';
import crypto from 'crypto';

const router = express.Router();

// Login (existing)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const retailer = await Retailer.findOne({ where: { email, password } });

        if (!retailer) return res.status(401).json({ error: 'Invalid credentials' });
        if (!retailer.verified) return res.status(403).json({ error: 'Email not verified' });

        const store = await Store.findOne({ where: { ownerId: retailer.id } });
        res.json({ retailer, store });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register new retailer
router.post('/register', async (req, res) => {
    try {
        const { email, password, storeName, storeAddress, phone, latitude, longitude } = req.body;

        // Validation
        if (!email || !password || !storeName || !storeAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if email exists
        const existing = await Retailer.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Create retailer
        const retailerId = `retailer-${Date.now()}`;
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const retailer = await Retailer.create({
            id: retailerId,
            email,
            password, // TODO: Hash in production
            storeName,
            phoneNumber: phone,
            verified: true, // Auto-verify for demo
            verificationToken
        });

        // Create store
        const store = await Store.create({
            id: `store-${Date.now()}`,
            name: storeName,
            address: storeAddress,
            latitude: latitude || 28.6139,
            longitude: longitude || 77.2090,
            rating: 0,
            phone: phone,
            hours: '10:00 AM - 09:00 PM',
            ownerId: retailerId,
            verificationStatus: 'approved'
        });

        res.status(201).json({
            message: 'Registration successful!',
            retailer: {
                id: retailer.id,
                email: retailer.email,
                storeName: retailer.storeName
            },
            store
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
