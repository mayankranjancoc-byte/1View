import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, Retailer, Store, Product, Search, Sale } from './db.js';
import { Op } from 'sequelize';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// ==================== ROUTES ====================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// ==================== ROUTES ====================

// Search Products
app.get('/api/products/search', async (req, res) => {
    try {
        const { q, lat, lng } = req.query;
        if (!q) return res.status(400).json({ error: 'Query required' });

        const userLat = parseFloat(lat) || 28.6139;
        const userLng = parseFloat(lng) || 77.2090;

        // Log Search
        await Search.create({
            id: `search-${Date.now()}`,
            query: q.toLowerCase(),
            lat: userLat,
            lng: userLng
        });

        // Find products matching query
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${q}%` } },
                    { category: { [Op.like]: `%${q}%` } }
                ]
            },
            include: [Store]
        });

        // Group by product name
        const productGroups = {};

        products.forEach(p => {
            const store = p.Store;
            if (!store) return;

            const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);
            const bestDealScore = (p.price / 300000) * 0.7 + (Math.min(distance / 50, 1) * 0.3);

            if (!productGroups[p.name]) {
                productGroups[p.name] = {
                    name: p.name,
                    category: p.category,
                    image: p.image,
                    stores: []
                };
            }

            productGroups[p.name].stores.push({
                storeId: store.id,
                storeName: store.name,
                address: store.address,
                rating: store.rating,
                price: p.price,
                quantity: p.quantity,
                offers: p.offers,
                distance: parseFloat(distance.toFixed(2)),
                bestDealScore,
                latitude: store.latitude,
                longitude: store.longitude
            });
        });

        // Sort and pick best deal
        Object.values(productGroups).forEach(group => {
            group.stores.sort((a, b) => a.bestDealScore - b.bestDealScore);
            if (group.stores.length > 0) group.stores[0].isBestDeal = true;
        });

        res.json({ results: Object.values(productGroups), userLocation: { lat: userLat, lng: userLng } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get Store by ID
app.get('/api/stores/:id', async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) return res.status(404).json({ error: 'Store not found' });

        const products = await Product.findAll({ where: { storeId: req.params.id } });

        // Convert sequelize model to plain object and add products
        const storeData = store.toJSON();
        storeData.products = products;

        res.json(storeData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retailer Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const retailer = await Retailer.findOne({ where: { email, password } });

        if (!retailer) return res.status(401).json({ error: 'Invalid credentials' });

        const store = await Store.findOne({ where: { ownerId: retailer.id } });
        res.json({ retailer, store });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retailer Products
app.get('/api/retailer/products/:storeId', async (req, res) => {
    try {
        const products = await Product.findAll({ where: { storeId: req.params.storeId } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/retailer/products', async (req, res) => {
    try {
        const newProduct = await Product.create({
            id: `prod-${Date.now()}`,
            ...req.body
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/retailer/products/:id', async (req, res) => {
    try {
        await Product.update(req.body, { where: { id: req.params.id } });
        const updated = await Product.findByPk(req.params.id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/retailer/products/:id', async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analytics: Trending
app.get('/api/analytics/trending/:storeId', async (req, res) => {
    try {
        // Simplified trending logic for demo
        const trending = [
            { name: "iPhone 15 Pro", searches: 45 },
            { name: "MacBook Air", searches: 32 },
            { name: "Sony Headphones", searches: 28 },
            { name: "Samsung S24", searches: 25 },
            { name: "USB-C Cable", searches: 15 }
        ];
        res.json(trending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync Database & Start Server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 1View API Server (SQLite) running on http://localhost:${PORT}`);
    });
});
