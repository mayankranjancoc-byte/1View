import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ProductResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const query = searchParams.get('q');
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await searchProducts(query, lat, lng);
        setResults(data.results);
        setUserLocation(data.userLocation);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (query && lat && lng) {
      fetchResults();
    }
  }, [query, lat, lng]);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Searching for best deals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>Error: {error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  return (
    <div className="product-results">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="1View" />
          </div>
          <div className="search-summary">
            <p>Showing results for: <strong>{query}</strong></p>
          </div>
        </div>
      </nav>

      <div className="container results-container">
        {/* Header */}
        <div className="results-header">
          <div>
            <h1>Found {results.length} {results.length === 1 ? 'product' : 'products'}</h1>
            <p className="text-secondary">Comparing prices across nearby stores</p>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn btn-secondary"
          >
            {showMap ? '📋 List View' : '🗺️ Map View'}
          </button>
        </div>

        {results.length === 0 ? (
          <div className="no-results">
            <h2>No products found</h2>
            <p>Try searching for something else</p>
            <button onClick={() => navigate('/')} className="btn btn-primary mt-lg">
              Back to Home
            </button>
          </div>
        ) : showMap ? (
          <div className="map-container">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={12}
              style={{ height: '600px', width: '100%', borderRadius: 'var(--radius-xl)' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {results.flatMap(product =>
                product.stores.map(store => (
                  <Marker
                    key={store.storeId}
                    position={[store.latitude, store.longitude]}
                  >
                    <Popup>
                      <strong>{store.storeName}</strong><br />
                      {product.name}<br />
                      {formatPrice(store.price)}
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>
        ) : (
          <div className="products-list">
            {results.map((product, index) => (
              <div key={index} className="product-group">
                <div className="product-header">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div>
                    <h2>{product.name}</h2>
                    <span className="badge badge-primary">{product.category}</span>
                  </div>
                </div>

                <div className="stores-comparison">
                  <h3>Available at {product.stores.length} stores:</h3>
                  <div className="stores-grid">
                    {product.stores.map((store) => (
                      <div
                        key={store.storeId}
                        className={`glass-card store-card ${store.isBestDeal ? 'best-deal' : ''}`}
                        onClick={() => navigate(`/store/${store.storeId}`)}
                      >
                        {store.isBestDeal && (
                          <div className="best-deal-badge">
                            <span className="badge badge-best-deal">⭐ BEST DEAL</span>
                          </div>
                        )}

                        <div className="store-card-header">
                          <h4>{store.storeName}</h4>
                          <div className="rating">
                            ⭐ {store.rating}
                          </div>
                        </div>

                        <div className="store-details">
                          <div className="detail-item">
                            <span className="detail-label">Price:</span>
                            <span className="detail-value price">{formatPrice(store.price)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Distance:</span>
                            <span className="detail-value">{store.distance} km</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Stock:</span>
                            <span className={`detail-value ${store.quantity < 5 ? 'low-stock' : 'in-stock'}`}>
                              {store.quantity} available
                            </span>
                          </div>
                        </div>

                        {store.offers && (
                          <div className="offer-tag">
                            🎁 {store.offers}
                          </div>
                        )}

                        <div className="store-address">
                          📍 {store.address}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .loading-screen, .error-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-lg);
        }

        .results-container {
          padding: var(--space-2xl) var(--space-lg);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2xl);
        }

        .search-summary {
          color: var(--text-secondary);
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }

        .product-group {
          background: rgba(30, 41, 59, 0.5);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .product-header {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .product-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .stores-comparison h3 {
          margin-bottom: var(--space-lg);
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .store-card {
          position: relative;
          cursor: pointer;
padding: var(--space-lg);
          transition: all var(--transition-base);
        }

        .store-card.best-deal {
          border: 2px solid rgba(245, 158, 11, 0.5);
          background: rgba(245, 158, 11, 0.05);
        }

        .store-card:hover {
          transform: translateY(-4px);
        }

        .best-deal-badge {
          position: absolute;
          top: -12px;
          right: var(--space-lg);
        }

        .store-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .rating {
          color: var(--warning);
          font-weight: 600;
        }

        .store-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .detail-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .detail-value.price {
          font-size: 1.5rem;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .low-stock {
          color: var(--warning) !important;
        }

        .in-stock {
          color: var(--success) !important;
        }

        .offer-tag {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-bottom: var(--space-md);
        }

        .store-address {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .no-results {
          text-align: center;
          padding: var(--space-2xl);
        }

        .map-container {
          margin-top: var(--space-xl);
        }

        @media (max-width: 768px) {
          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }

          .stores-grid {
            grid-template-columns: 1fr;
          }

          .product-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
