import { findStoreById, findProductsByStore } from '../../_lib/db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        const store = findStoreById(id);

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const products = findProductsByStore(id);

        res.json({
            ...store,
            products
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
