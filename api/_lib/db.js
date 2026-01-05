// In-memory database for Vercel deployment
// Data resets on each deployment

const LOCATIONS = [
    { name: "Connaught Place", lat: 28.6304, lng: 77.2177 },
    { name: "Nehru Place", lat: 28.5494, lng: 77.2501 },
    { name: "Lajpat Nagar", lat: 28.5677, lng: 77.2431 },
    { name: "Karol Bagh", lat: 28.6519, lng: 77.1903 },
    { name: "Saket", lat: 28.5244, lng: 77.2185 }
];

const PRODUCTS_CATALOG = {
    Smartphones: [
        { name: "iPhone 15 Pro", price: 129900, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300" },
        { name: "Samsung Galaxy S24 Ultra", price: 124999, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300" },
        { name: "OnePlus 12", price: 64999, image: "https://images.unsplash.com/photo-1691436152391-766b2628ce82?w=300" }
    ],
    Laptops: [
        { name: "MacBook Air M2", price: 99900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" },
        { name: "Dell XPS 15", price: 145000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300" }
    ],
    Audio: [
        { name: "Sony WH-1000XM5", price: 29990, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300" },
        { name: "AirPods Pro 2", price: 24900, image: "https://images.unsplash.com/photo-1603351154351-5cf99bf43a6f?w=300" }
    ],
    Accessories: [
        { name: "USB-C to C Cable", price: 499, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300" },
        { name: "20W Fast Charger", price: 1499, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300" }
    ]
};

// Initialize data
const retailers = [];
const stores = [];
const products = [];
const searches = [];
const sales = [];

// Seed initial data
function seedData() {
    // Create 5 demo stores
    for (let i = 0; i < 5; i++) {
        const loc = LOCATIONS[i];
        const retailerId = `retailer-${i + 1}`;
        const storeId = `store-${i + 1}`;

        retailers.push({
            id: retailerId,
            email: i === 0 ? "techhub@example.com" : `store${i + 1}@example.com`,
            password: "demo123",
            storeName: i === 0 ? "TechHub Electronics" : `${loc.name} Electronics`,
            verified: true
        });

        stores.push({
            id: storeId,
            name: i === 0 ? "TechHub Electronics" : `${loc.name} Electronics`,
            address: `${loc.name}, Delhi`,
            latitude: loc.lat,
            longitude: loc.lng,
            rating: (3.5 + Math.random() * 1.5).toFixed(1),
            phone: `+91 98765 432${i.toString().padStart(2, '0')}`,
            hours: "10:00 AM - 09:00 PM",
            ownerId: retailerId
        });

        // Add products to each store
        Object.entries(PRODUCTS_CATALOG).forEach(([category, items]) => {
            items.forEach(item => {
                const variance = 0.95 + Math.random() * 0.1;
                products.push({
                    id: `prod-${storeId}-${item.name.replace(/\s+/g, '-')}`,
                    name: item.name,
                    category,
                    image: item.image,
                    price: Math.round(item.price * variance),
                    quantity: Math.floor(Math.random() * 50) + 10,
                    offers: Math.random() > 0.7 ? "10% off" : null,
                    storeId
                });
            });
        });
    }

    console.log('✅ In-memory database initialized with demo data');
}

// Seed data on module load
seedData();

// Helper functions
export function getRetailers() {
    return retailers;
}

export function getStores() {
    return stores;
}

export function getProducts() {
    return products;
}

export function getSearches() {
    return searches;
}

export function getSales() {
    return sales;
}

export function findRetailerByEmail(email) {
    return retailers.find(r => r.email === email);
}

export function findStoreById(id) {
    return stores.find(s => s.id === id);
}

export function findProductById(id) {
    return products.find(p => p.id === id);
}

export function findProductsByStore(storeId) {
    return products.filter(p => p.storeId === storeId);
}

export function findProductsByQuery(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

export function addProduct(productData) {
    const newProduct = {
        id: `prod-${Date.now()}`,
        ...productData
    };
    products.push(newProduct);
    return newProduct;
}

export function updateProduct(id, updates) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        return products[index];
    }
    return null;
}

export function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        return true;
    }
    return false;
}

export function addSearch(searchData) {
    const newSearch = {
        id: `search-${Date.now()}`,
        timestamp: new Date(),
        ...searchData
    };
    searches.push(newSearch);
    return newSearch;
}

export function addSale(saleData) {
    const newSale = {
        id: `sale-${Date.now()}`,
        timestamp: new Date(),
        ...saleData
    };
    sales.push(newSale);
    return newSale;
}
