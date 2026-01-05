import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductResults from './pages/ProductResults';
import StoreDetail from './pages/StoreDetail';
import RetailerAuth from './pages/RetailerAuth';
import RetailerSignup from './pages/RetailerSignup';
import RetailerDashboard from './pages/RetailerDashboard';
import ProductManagement from './pages/ProductManagement';
import OfflineBilling from './pages/OfflineBilling';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import { useState } from 'react';

function App() {
    const [userLocation, setUserLocation] = useState(null);
    const [retailer, setRetailer] = useState(null);

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<HomePage userLocation={userLocation} setUserLocation={setUserLocation} />} />
                    <Route path="/search" element={<ProductResults userLocation={userLocation} />} />
                    <Route path="/store/:id" element={<StoreDetail userLocation={userLocation} />} />
                    <Route path="/retailer/login" element={<RetailerAuth setRetailer={setRetailer} />} />
                    <Route path="/retailer/signup" element={<RetailerSignup />} />
                    <Route path="/retailer/dashboard" element={<RetailerDashboard retailer={retailer} />} />
                    <Route path="/retailer/products" element={<ProductManagement retailer={retailer} />} />
                    <Route path="/retailer/billing" element={<OfflineBilling retailer={retailer} />} />
                    <Route path="/retailer/analytics" element={<AnalyticsDashboard retailer={retailer} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
