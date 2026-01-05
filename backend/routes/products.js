import express from 'express';
import { searchProducts, getProductDetails } from '../services/productAPI.js';

const router = express.Router();

// Search products via external API
router.get('/api-search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        const results = await searchProducts(q);
        res.json({ results, source: 'api' });

    } catch (error) {
        console.error('API search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get product details by ASIN
router.get('/api-details/:asin', async (req, res) => {
    try {
        const { asin } = req.params;
        const product = await getProductDetails(asin);
        res.json(product);

    } catch (error) {
        console.error('API details error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
