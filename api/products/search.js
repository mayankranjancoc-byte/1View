import { getProducts, getStores, addSearch } from '../_lib/db.js';

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
        const { q, lat, lng } = req.query;
        if (!q) return res.status(400).json({ error: 'Query required' });

        const userLat = parseFloat(lat) || 28.6139;
        const userLng = parseFloat(lng) || 77.2090;

        // Log search
        addSearch({
            query: q.toLowerCase(),
            lat: userLat,
            lng: userLng
        });

        // Find products matching query
        const allProducts = getProducts();
        const stores = getStores();
        const storeMap = {};
        stores.forEach(s => storeMap[s.id] = s);

        const lowerQuery = q.toLowerCase();
        const matchingProducts = allProducts.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );

        // Group by product name
        const productGroups = {};

        matchingProducts.forEach(p => {
            const store = storeMap[p.storeId];
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

        res.json({
            results: Object.values(productGroups),
            userLocation: { lat: userLat, lng: userLng }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
