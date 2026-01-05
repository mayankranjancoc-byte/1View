// Product API Service - Demo Implementation
// In production, replace with real Amazon/Flipkart API

// Demo product database for API simulation
const DEMO_PRODUCTS = [
    { asin: 'B0CHX1W1XY', name: 'Apple iPhone 15 Pro (128GB)', price: 129900, image: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg', category: 'Smartphones' },
    { asin: 'B0CHX2F5QT', name: 'Apple iPhone 15 Pro Max (256GB)', price: 159900, image: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg', category: 'Smartphones' },
    { asin: 'B0BX7GYL5J', name: 'Samsung Galaxy S24 Ultra 5G', price: 124999, image: 'https://m.media-amazon.com/images/I/71qNJfvSeJL._SL1500_.jpg', category: 'Smartphones' },
    { asin: 'B0CNXYZ123', name: 'OnePlus 12 5G', price: 64999, image: 'https://m.media-amazon.com/images/I/71ZDY57yTGL._SL1500_.jpg', category: 'Smartphones' },
    { asin: 'B0C63RMWMF', name: 'Apple MacBook Air M2', price: 99900, image: 'https://m.media-amazon.com/images/I/719C6bJv8jL._SL1500_.jpg', category: 'Laptops' },
    { asin: 'B09RP5BXX1', name: 'Dell XPS 15 9530', price: 145000, image: 'https://m.media-amazon.com/images/I/61hT3af7+IL._SL1500_.jpg', category: 'Laptops' },
    { asin: 'B0BSHF7HNY', name: 'Sony WH-1000XM5 Headphones', price: 29990, image: 'https://m.media-amazon.com/images/I/61vJG3p+9DL._SL1500_.jpg', category: 'Audio' },
    { asin: 'B0CHWRXH8B', name: 'Apple AirPods Pro (2nd Gen)', price: 24900, image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg', category: 'Audio' },
    { asin: 'B09JQL3NWT', name: 'JBL Flip 6 Bluetooth Speaker', price: 9999, image: 'https://m.media-amazon.com/images/I/71i2XhHHZeL._SL1500_.jpg', category: 'Audio' },
    { asin: 'B0CXY12345', name: 'USB-C to USB-C Cable (2m)', price: 499, image: 'https://m.media-amazon.com/images/I/61AYKqlVdjL._SL1500_.jpg', category: 'Accessories' },
    { asin: 'B08L5Z9YXL', name: 'Anker 20W USB-C Charger', price: 1499, image: 'https://m.media-amazon.com/images/I/51S4f+-OOWL._SL1500_.jpg', category: 'Accessories' },
    { asin: 'B07XYZ1234', name: 'Milton Thermosteel Water Bottle', price: 799, image: 'https://m.media-amazon.com/images/I/61hcHLj+GJL._SL1500_.jpg', category: 'General' }
];

/**
 * Search for products by query
 * @param {string} query - Search term
 * @returns {Promise<Array>} - Array of product results
 */
export async function searchProducts(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowerQuery = query.toLowerCase();
    const results = DEMO_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );

    return results.map(p => ({
        asin: p.asin,
        title: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        source: 'demo-api'
    }));
}

/**
 * Get detailed product info by ASIN
 * @param {string} asin - Amazon Standard Identification Number
 * @returns {Promise<Object>} - Detailed product info
 */
export async function getProductDetails(asin) {
    await new Promise(resolve => setTimeout(resolve, 200));

    const product = DEMO_PRODUCTS.find(p => p.asin === asin);
    if (!product) {
        throw new Error('Product not found');
    }

    return {
        asin: product.asin,
        title: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: `High-quality ${product.category} product with excellent features.`,
        source: 'demo-api'
    };
}

// TODO: For production, replace with real API integration:
// - Amazon Product Advertising API
// - Flipkart Affiliate API
// - RapidAPI alternatives
