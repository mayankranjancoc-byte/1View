import { getRetailers, getStores } from '../../_lib/db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        const retailer = getRetailers().find(r => r.email === email && r.password === password);

        if (!retailer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const store = getStores().find(s => s.ownerId === retailer.id);

        res.json({ retailer, store });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
