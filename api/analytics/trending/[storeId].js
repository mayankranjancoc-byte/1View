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
        // Simplified trending logic for demo
        const trending = [
            { name: "iPhone 15 Pro", searches: 45 },
            { name: "MacBook Air M2", searches: 32 },
            { name: "Sony WH-1000XM5", searches: 28 },
            { name: "Samsung Galaxy S24 Ultra", searches: 25 },
            { name: "USB-C to C Cable", searches: 15 }
        ];

        res.json(trending);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
