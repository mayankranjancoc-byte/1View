import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRetailerProducts, getTrendingProducts, getTopSearches } from '../services/api';

export default function RetailerDashboard({ retailer }) {
    const [products, setProducts] = useState([]);
    const [trending, setTrending] = useState([]);
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!retailer) {
            const stored = localStorage.getItem('retailer');
            if (!stored) {
                navigate('/retailer/login');
                return;
            }
        }

        const fetchData = async () => {
            try {
                const storedRetailer = retailer || JSON.parse(localStorage.getItem('retailer'));
                const storeId = storedRetailer.store.id;

                const [productsData, trendingData, searchesData] = await Promise.all([
                    getRetailerProducts(storeId),
                    getTrendingProducts(storeId),
                    getTopSearches(storeId)
                ]);

                setProducts(productsData);
                setTrending(trendingData);
                setSearches(searchesData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [retailer, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('retailer');
        navigate('/retailer/login');
    };

    const storedRetailer = retailer || JSON.parse(localStorage.getItem('retailer') || '{}');
    const lowStockItems = products.filter(p => p.quantity < 5).length;

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="retailer-dashboard">
            {/* Navbar */}
            <nav className="navbar retailer-nav">
                <div className="container navbar-content">
                    <div className="logo">🏪 {storedRetailer.retailer?.storeName}</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/retailer/dashboard')} className="nav-link active">Dashboard</button>
                        <button onClick={() => navigate('/retailer/products')} className="nav-link">Products</button>
                        <button onClick={() => navigate('/retailer/billing')} className="nav-link">Billing</button>
                        <button onClick={() => navigate('/retailer/analytics')} className="nav-link">Analytics</button>
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container dashboard-container">
                <h1 className="dashboard-title">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="glass-card stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-value">{products.length}</div>
                        <div className="stat-label">Total Products</div>
                    </div>

                    <div className="glass-card stat-card warning">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-value">{lowStockItems}</div>
                        <div className="stat-label">Low Stock Items</div>
                    </div>

                    <div className="glass-card stat-card success">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-value">{trending.length}</div>
                        <div className="stat-label">Trending Products</div>
                    </div>

                    <div className="glass-card stat-card primary">
                        <div className="stat-icon">🔍</div>
                        <div className="stat-value">{searches.slice(0, 5).reduce((sum, s) => sum + s.count, 0)}</div>
                        <div className="stat-label">Total Searches</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <button onClick={() => navigate('/retailer/products')} className="action-btn glass-card">
                            <span className="action-icon">➕</span>
                            <span>Add New Product</span>
                        </button>
                        <button onClick={() => navigate('/retailer/billing')} className="action-btn glass-card">
                            <span className="action-icon">💳</span>
                            <span>Record Sale</span>
                        </button>
                        <button onClick={() => navigate('/retailer/analytics')} className="action-btn glass-card">
                            <span className="action-icon">📊</span>
                            <span>View Analytics</span>
                        </button>
                    </div>
                </div>

                {/* Trending & Searches */}
                <div className="insights-grid">
                    <div className="glass-card insight-card">
                        <h3>🔥 Trending Products</h3>
                        {trending.length > 0 ? (
                            <div className="list">
                                {trending.map((item, index) => (
                                    <div key={index} className="list-item">
                                        <span>{item.name}</span>
                                        <span className="badge badge-success">{item.searches} searches</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-secondary">No trending data yet</p>
                        )}
                    </div>

                    <div className="glass-card insight-card">
                        <h3>🔍 Top Searches</h3>
                        {searches.length > 0 ? (
                            <div className="list">
                                {searches.slice(0, 5).map((item, index) => (
                                    <div key={index} className="list-item">
                                        <span>{item.query}</span>
                                        <span className="badge badge-primary">{item.count}x</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-secondary">No search data yet</p>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .retailer-dashboard {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .retailer-nav {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
        }

        .nav-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: var(--space-md) var(--space-lg);
          cursor: pointer;
          transition: color var(--transition-fast);
          font-weight: 500;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--retailer-color);
        }

        .btn-sm {
          padding: var(--space-sm) var(--space-lg);
          font-size: 0.875rem;
        }

        .dashboard-container {
          padding: var(--space-2xl) var(--space-lg);
        }

        .dashboard-title {
          margin-bottom: var(--space-xl);
          background: var(--retailer-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }

        .stat-card {
          text-align: center;
          padding: var(--space-xl);
        }

        .stat-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-sm);
        }

        .stat-card.warning .stat-value {
          color: var(--warning);
        }

        .stat-card.success .stat-value {
          color: var(--success);
        }

        .stat-card.primary .stat-value {
          color: var(--primary-color);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .quick-actions {
          margin-bottom: var(--space-2xl);
        }

        .quick-actions h2 {
          margin-bottom: var(--space-lg);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-lg);
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-xl);
          border: none;
          background: rgba(30, 41, 59, 0.7);
          cursor: pointer;
          transition: all var(--transition-base);
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
        }

        .action-btn:hover {
          transform: translateY(-4px);
          border-color: var(--retailer-color);
        }

        .action-icon {
          font-size: 2rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-lg);
        }

        .insight-card {
          padding: var(--space-xl);
        }

        .insight-card h3 {
          margin-bottom: var(--space-lg);
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background: var(--surface);
          border-radius: var(--radius-md);
        }

        @media (max-width: 768px) {
          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
