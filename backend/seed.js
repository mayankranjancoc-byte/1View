import { sequelize, Retailer, Store, Product, Search, Sale } from './db.js';

const LOCATIONS = [
    { name: "Connaught Place", lat: 28.6304, lng: 77.2177 },
    { name: "Nehru Place", lat: 28.5494, lng: 77.2501 },
    { name: "Lajpat Nagar", lat: 28.5677, lng: 77.2431 },
    { name: "Karol Bagh", lat: 28.6519, lng: 77.1903 },
    { name: "Saket", lat: 28.5244, lng: 77.2185 },
    { name: "Vasant Kunj", lat: 28.5292, lng: 77.1509 },
    { name: "Chandni Chowk", lat: 28.6506, lng: 77.2303 },
    { name: "Dwarka Sector 10", lat: 28.5799, lng: 77.0567 },
    { name: "Rohini Sector 7", lat: 28.7073, lng: 77.1260 },
    { name: "Greater Kailash", lat: 28.5539, lng: 77.2330 }
];

const STORE_TYPES = [
    "Electronics", "General Store", "Stationery", "Mobile Hub", "Digital World"
];

const PRODUCTS = {
    Smartphones: [
        { name: "iPhone 15 Pro", price: 129900, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300" },
        { name: "Samsung Galaxy S24 Ultra", price: 124999, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300" },
        { name: "OnePlus 12", price: 64999, image: "https://images.unsplash.com/photo-1691436152391-766b2628ce82?w=300" },
        { name: "Google Pixel 8 Pro", price: 75999, image: "https://images.unsplash.com/photo-1696426767551-fa7e661005a8?w=300" }
    ],
    Laptops: [
        { name: "MacBook Air M2", price: 99900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" },
        { name: "Dell XPS 15", price: 145000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300" },
        { name: "HP Spectre x360", price: 110000, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300" }
    ],
    Audio: [
        { name: "Sony WH-1000XM5", price: 29990, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300" },
        { name: "AirPods Pro 2", price: 24900, image: "https://images.unsplash.com/photo-1603351154351-5cf99bf43a6f?w=300" },
        { name: "JBL Flip 6", price: 9999, image: "https://images.unsplash.com/photo-1628144047802-3932768a3627?w=300" }
    ],
    Accessories: [
        { name: "USB-C to C Cable", price: 499, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300" },
        { name: "20W Fast Charger", price: 1499, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300" },
        { name: "Phone Stand", price: 299, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300" }
    ],
    Stationery: [
        { name: "Premium Notebook", price: 299, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300" },
        { name: "Parker Vector Pen", price: 350, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=300" },
        { name: "Sticky Notes", price: 99, image: "https://images.unsplash.com/photo-1586075010923-2dd4500f40ce?w=300" }
    ],
    General: [
        { name: "Milton Water Bottle", price: 799, image: "https://images.unsplash.com/photo-1602143407151-011141957516?w=300" },
        { name: "Duracell AA Batteries", price: 199, image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=300" },
        { name: "Umbrella", price: 599, image: "https://images.unsplash.com/photo-1556909212-324f02e7d62d?w=300" }
    ]
};

const OFFERS = ["10% off", "Buy 1 Get 1", "Free Gift", "Student Discount", null, null, null];

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("📦 Database cleared and synced.");

        const retailers = [];
        const stores = [];

        // Create Retailers and Stores
        for (let i = 0; i < 20; i++) {
            const loc = LOCATIONS[i % LOCATIONS.length];
            const type = STORE_TYPES[i % STORE_TYPES.length];
            const name = `${loc.name} ${type}`;
            const email = `store${i + 1}@example.com`;

            // Special easy login accounts
            const isDemo = i === 0;
            const finalEmail = isDemo ? "techhub@example.com" : email;
            const finalName = isDemo ? "TechHub Electronics" : name;

            const retailer = await Retailer.create({
                id: `retailer-${i + 1}`,
                email: finalEmail,
                password: "demo123",
                storeName: finalName
            });

            const store = await Store.create({
                id: `store-${i + 1}`,
                name: finalName,
                address: `${loc.name}, Delhi`,
                latitude: loc.lat + (Math.random() * 0.01 - 0.005), // Jitter location slightly
                longitude: loc.lng + (Math.random() * 0.01 - 0.005),
                rating: (3.5 + Math.random() * 1.5).toFixed(1),
                phone: `+91 98765 432${i.toString().padStart(2, '0')}`,
                hours: "10:00 AM - 09:00 PM",
                ownerId: retailer.id
            });

            retailers.push(retailer);
            stores.push(store);
            console.log(`✅ Created Store: ${finalName}`);
        }

        // Create Products and Sales for each store
        for (const store of stores) {
            // Give each store a random subset of products (15-30 items)
            const numProducts = 15 + Math.floor(Math.random() * 15);

            for (let j = 0; j < numProducts; j++) {
                const categories = Object.keys(PRODUCTS);
                const cat = categories[Math.floor(Math.random() * categories.length)];
                const item = PRODUCTS[cat][Math.floor(Math.random() * PRODUCTS[cat].length)];

                // Vary price slightly per store
                const variance = 0.95 + Math.random() * 0.1; // +/- 5%
                const finalPrice = Math.round(item.price * variance);

                const product = await Product.create({
                    id: `prod-${store.id}-${Date.now()}-${j}`,
                    name: item.name,
                    category: cat,
                    image: item.image,
                    price: finalPrice,
                    quantity: Math.floor(Math.random() * 50),
                    offers: OFFERS[Math.floor(Math.random() * OFFERS.length)],
                    storeId: store.id
                });

                // DATA SEEDING: Fake Sales
                // 40% chance a product has sales history
                if (Math.random() > 0.6) {
                    const numSales = Math.floor(Math.random() * 8) + 1;
                    for (let k = 0; k < numSales; k++) {
                        await Sale.create({
                            id: `sale-${product.id}-${k}`,
                            storeId: store.id,
                            productId: product.id,
                            quantity: Math.floor(Math.random() * 3) + 1,
                            billId: `BILL-${Math.floor(Math.random() * 10000)}`,
                            timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random time in past
                        });
                    }
                }
            }
        }
        console.log("📦 Seeded products and sales.");

        // Create Fake Search History (Increased Volume)
        const queries = [
            "iphone", "laptop", "headphones", "charger", "bottle",
            "samsung", "macbook", "earbuds", "type c", "notebook",
            "sony", "jbl", "pen", "water bottle", "batteries", "shoes", "bag"
        ];

        for (let i = 0; i < 300; i++) {
            await Search.create({
                id: `search-${i}`,
                query: queries[Math.floor(Math.random() * queries.length)],
                lat: 28.6139 + (Math.random() * 0.1 - 0.05),
                lng: 77.2090 + (Math.random() * 0.1 - 0.05),
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
            });
        }
        console.log("📦 Seeded analytics data.");

        console.log("🚀 Database seeding complete! You are ready to go.");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
