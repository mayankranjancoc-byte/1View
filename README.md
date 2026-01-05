# 🛒 OmniRetail - Omnichannel Retail Platform

A full-stack real-time retail application connecting customers with nearby physical stores for price comparison and inventory discovery.

## ✨ Features

### Customer Features
- 🌍 **Location Detection** - Automatic GPS location or manual selection
- 🔍 **Product Search** - Search across all stores in real-time
- 💰 **Price Comparison** - Compare prices and find best deals
- 📍 **Store Locator** - Interactive maps showing nearby stores
- ⭐ **Best Deal Algorithm** - Smart recommendations based on price + distance
- 📊 **Stock Availability** - Real-time inventory levels

### Retailer Features
- 🏪 **Dashboard** - Overview of products, sales, and analytics
- 📦 **Product Management** - Add, edit, and delete products
- 💳 **Offline Billing** - Sync in-store sales with online inventory
- 📈 **Analytics** - Trending products, demand analysis, stock suggestions
- 🔥 **Insights** - Search trends and customer demand patterns

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

### Running the Application

**Option 1: Run Both Servers (Recommended)**

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

**Option 2: Manual Commands**

If npm scripts don't work, run manually:

**Frontend:**
```bash
node_modules/.bin/vite
```

**Backend:**
```bash
node backend/server.js
```

### Access the Application

- **Customer View**: http://localhost:5173
- **Retailer Login**: http://localhost:5173/retailer/login
- **Backend API**: http://localhost:3001

## 🔑 Demo Credentials

All retailer accounts use password: `demo123`

| Store | Email |
|-------|-------|
| TechHub Electronics | techhub@example.com |
| Gadget Galaxy | gadget@example.com |
| Digital Dreams | digital@example.com |
| SmartBuy Store | smartbuy@example.com |
| Metro Electronics | metro@example.com |

## 📱 Demo Workflow

### Customer Journey
1. Open homepage at http://localhost:5173
2. Allow location access (or use default Delhi location)
3. Search for products: "iPhone", "MacBook", "Headphones"
4. View price comparison across stores
5. See "Best Deal" recommendations
6. Click on a store to see details and map
7. View full product catalog

### Retailer Journey
1. Go to http://localhost:5173/retailer/login
2. Use demo credentials to login
3. View dashboard with stats and insights
4. **Add Product**: Navigate to Products → Add Product
5. **Record Sale**: Go to Billing → Select product → Record sale
6. **View Analytics**: Check Analytics for trending products and stock suggestions
7. Observe real-time inventory updates

## 🗂️ Project Structure

```
omniretail/
├── backend/
│   ├── server.js           # Express API server
│   ├── data/
│   │   └── database.json   # Dummy data (5 stores, 16 products)
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx              # Customer landing page
│   │   ├── ProductResults.jsx        # Search results with comparison
│   │   ├── StoreDetail.jsx           # Store details + map
│   │   ├── RetailerAuth.jsx          # Login page
│   │   ├── RetailerDashboard.jsx     # Dashboard overview
│   │   ├── ProductManagement.jsx     # CRUD operations
│   │   ├── OfflineBilling.jsx        # Sales sync
│   │   └── AnalyticsDashboard.jsx    # Charts & insights
│   ├── services/
│   │   └── api.js                    # API integration layer
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Design system
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 Technology Stack

- **Frontend**: React + Vite
- **Routing**: React Router DOM
- **Maps**: Leaflet.js + React Leaflet
- **Charts**: Chart.js + React Chart.js 2
- **Backend**: Node.js + Express
- **Data**: JSON file-based database
- **Styling**: Vanilla CSS with glassmorphism design

## 🧪 Testing Features

### 1. Search Functionality
- Search "iPhone" → See 3 stores with different prices
- Best Deal badge appears on optimal choice (price + distance)

### 2. Real-time Inventory Sync
- Login as retailer
- Go to Billing → Record a sale
- Search for same product as customer
- Stock count should decrease immediately

### 3. Analytics
- Login as retailer
- Record multiple sales
- Check Analytics dashboard
- See trending products and demand charts

### 4. Map Integration
- Search for any product
- Toggle Map View
- See all stores with markers
- Click markers for store info

## 📊 Dummy Data

The app includes realistic dummy data:
- **5 Stores** across Delhi with GPS coordinates
- **16 Products** (iPhones, MacBooks, Samsung, Headphones, etc.)
- **Varying Prices** for price comparison demo
- **Search History** for analytics
- **Sales Records** for trend analysis

## 🔥 Key Features for Demo

1. **Best Deal Algorithm**: Weighted score (70% price, 30% distance)
2. **Real-time Sync**: Offline sales instantly update online inventory
3. **Location-based**: Haversine formula for accurate distance
4. **Responsive Design**: Mobile-first with glassmorphism UI
5. **Analytics**: Chart.js visualizations for business insights

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 3001 (backend)
npx kill-port 3001
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**PowerShell script execution blocked:**
- Run frontend: `node_modules/.bin/vite`
- Run backend: `node backend/server.js`

## 📝 License

MIT License - Built for hackathon demo

## 👥 Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- Network tab for API calls
