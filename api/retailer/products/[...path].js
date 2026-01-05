import {
    findProductsByStore,
    addProduct,
    updateProduct,
    deleteProduct,
    findProductById
} from '../../../_lib/db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { path } = req.query; // path is an array: ['storeId'] or ['productId']

        // GET /api/retailer/products/:storeId - Get all products for a store
        if (req.method === 'GET' && path.length === 1) {
            const storeId = path[0];
            const products = findProductsByStore(storeId);
            return res.json(products);
        }

        // POST /api/retailer/products - Add new product
        if (req.method === 'POST') {
            const newProduct = addProduct(req.body);
            return res.status(201).json(newProduct);
        }

        // PUT /api/retailer/products/:id - Update product
        if (req.method === 'PUT' && path.length === 1) {
            const productId = path[0];
            const updated = updateProduct(productId, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(updated);
        }

        // DELETE /api/retailer/products/:id - Delete product
        if (req.method === 'DELETE' && path.length === 1) {
            const productId = path[0];
            const deleted = deleteProduct(productId);
            if (!deleted) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json({ message: 'Deleted' });
        }

        return res.status(404).json({ error: 'Route not found' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
