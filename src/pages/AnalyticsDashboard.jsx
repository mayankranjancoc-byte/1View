import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getTrendingProducts, getTopSearches, getDemandAnalysis, getStockSuggestions } from '../services/api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export default function AnalyticsDashboard({ retailer }) {
    const [trending, setTrending] = useState([]);
    const [searches, setSearches] = useState([]);
    const [demand, setDemand] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const storedRetailer = retailer || JSON.parse(localStorage.getItem('retailer'));
            if (!storedRetailer) {
                navigate('/retailer/login');
                return;
            }

            const storeId = storedRetailer.store.id;
            const [trendingData, searchesData, demandData, suggestionsData] = await Promise.all([
                getTrendingProducts(storeId),
                getTopSearches(storeId),
                getDemandAnalysis(storeId),
                getStockSuggestions(storeId)
            ]);

            setTrending(trendingData);
            setSearches(searchesData);
            setDemand(demandData);
            setSuggestions(suggestionsData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Chart configurations
    const trendingChartData = {
        labels: trending.map(t => t.name),
        datasets: [{
            label: 'Search Count',
            data: trending.map(t => t.searches),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2
        }]
    };

    const searchesChartData = {
        labels: searches.slice(0, 8).map(s => s.query),
        datasets: [{
            label: 'Search Frequency',
            data: searches.slice(0, 8).map(s => s.count),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
        }]
    };

    const demandChartData = {
        labels: demand.slice(0, 6).map(d => d.name.substring(0, 20)),
        datasets: [
            {
                label: 'Searches',
                data: demand.slice(0, 6).map(d => d.searches),
                backgroundColor: 'rgba(168, 85, 247, 0.6)',
            },
            {
                label: 'Sales',
                data: demand.slice(0, 6).map(d => d.sales),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
            }
        ]
    };

    const categoryData = demand.reduce((acc, item) => {
        const category = item.name.includes('iPhone') || item.name.includes('Samsung') ? 'Smartphones' :
            item.name.includes('MacBook') || item.name.includes('Dell') ? 'Laptops' :
                item.name.includes('iPad') ? 'Tablets' :
                    item.name.includes('Headphones') ? 'Audio' : 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const categoryChartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ]
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#cbd5e1'
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#cbd5e1' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#cbd5e1' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#cbd5e1'
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            <nav className="navbar retailer-nav">
                <div className="container navbar-content">
                    <div className="logo" onClick={() => navigate('/retailer/dashboard')} style={{ cursor: 'pointer' }}>
                        🏪 Analytics Dashboard
                    </div>
                    <button onClick={() => navigate('/retailer/dashboard')} className="btn btn-secondary">
                        ← Dashboard
                    </button>
                </div>
            </nav>

            <div className="container analytics-container">
                <h1 className="analytics-title">Business Intelligence & Insights</h1>

                {/* Stock Suggestions */}
                {suggestions.length > 0 && (
                    <div className="glass-card suggestions-card">
                        <h2>📦 Stock Recommendations</h2>
                        <div className="suggestions-grid">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className={`suggestion-item priority-${suggestion.priority.toLowerCase()}`}>
                                    <div className="suggestion-header">
                                        <span className="suggestion-product">{suggestion.name}</span>
                                        <span className={`badge badge-${suggestion.priority === 'High' ? 'warning' : 'primary'}`}>
                                            {suggestion.priority} Priority
                                        </span>
                                    </div>
                                    <div className="suggestion-details">
                                        <div>Current Stock: <strong>{suggestion.currentStock}</strong></div>
                                        <div>Searches: <strong>{suggestion.searchCount}</strong></div>
                                    </div>
                                    <div className="suggestion-action">{suggestion.suggestion}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Charts Grid */}
                <div className="charts-grid">
                    <div className="glass-card chart-card">
                        <h3>🔥 Trending Products</h3>
                        {trending.length > 0 ? (
                            <Bar data={trendingChartData} options={chartOptions} />
                        ) : (
                            <p className="text-secondary">No trending data available</p>
                        )}
                    </div>

                    <div className="glass-card chart-card">
                        <h3>🔍 Top Search Queries</h3>
                        {searches.length > 0 ? (
                            <Bar data={searchesChartData} options={chartOptions} />
                        ) : (
                            <p className="text-secondary">No search data available</p>
                        )}
                    </div>

                    <div className="glass-card chart-card">
                        <h3>📊 Demand vs Sales Analysis</h3>
                        {demand.length > 0 ? (
                            <Bar data={demandChartData} options={chartOptions} />
                        ) : (
                            <p className="text-secondary">No demand data available</p>
                        )}
                    </div>

                    <div className="glass-card chart-card">
                        <h3>📈 Category Distribution</h3>
                        {Object.keys(categoryData).length > 0 ? (
                            <Pie data={categoryChartData} options={pieOptions} />
                        ) : (
                            <p className="text-secondary">No category data available</p>
                        )}
                    </div>
                </div>

                {/* Export Section */}
                <div className="export-section">
                    <button className="btn btn-success">
                        📥 Export Analytics Report
                    </button>
                </div>
            </div>

            <style jsx>{`
        .retailer-nav {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
        }

        .analytics-container {
          padding: var(--space-2xl) var(--space-lg);
        }

        .analytics-title {
          background: var(--retailer-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--space-2xl);
        }

        .suggestions-card {
          padding: var(--space-2xl);
          margin-bottom: var(--space-2xl);
        }

        .suggestions-card h2 {
          margin-bottom: var(--space-lg);
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .suggestion-item {
          padding: var(--space-lg);
          background: var(--surface);
          border-radius: var(--radius-md);
          border-left: 4px solid;
        }

        .suggestion-item.priority-high {
          border-left-color: var(--warning);
        }

        .suggestion-item.priority-medium {
          border-left-color: var(--info);
        }

        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .suggestion-product {
          font-weight: 600;
        }

        .suggestion-details {
          display: flex;
          gap: var(--space-lg);
          margin-bottom: var(--space-sm);
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .suggestion-action {
          color: var(--success);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: var(--space-xl);
          margin-bottom: var(--space-2xl);
        }

        .chart-card {
          padding: var(--space-xl);
        }

        .chart-card h3 {
          margin-bottom: var(--space-lg);
        }

        .export-section {
          text-align: center;
          padding: var(--space-xl);
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }

          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
