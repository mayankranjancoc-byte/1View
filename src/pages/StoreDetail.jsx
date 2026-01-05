import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoreById } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getStoreById(id);
        setStore(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="error-screen">
        <p>Store not found</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

  return (
    <div className="store-detail">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="1View" />
          </div>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            ← Back
          </button>
        </div>
      </nav>

      <div className="container store-container">
        {/* Store Header */}
        <div className="glass-card store-info">
          <h1>{store.name}</h1>
          <div className="rating-large">⭐ {store.rating} / 5.0</div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <div className="info-label">Address</div>
                <div className="info-value">{store.address}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <div className="info-label">Phone</div>
                <div className="info-value">{store.phone}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div>
                <div className="info-label">Hours</div>
                <div className="info-value">{store.hours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="map-section">
          <h2>Location</h2>
          <div className="map-wrapper">
            <MapContainer
              center={[store.latitude, store.longitude]}
              zoom={15}
              style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-xl)' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[store.latitude, store.longitude]}>
                <Popup>{store.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Products */}
        <div className="products-section">
          <h2>Available Products ({store.products?.length || 0})</h2>
          <div className="products-grid">
            {store.products && store.products.length > 0 ? (
              store.products.map((product) => (
                <div key={product.id} className="glass-card product-card">
                  <img src={product.image} alt={product.name} className="product-img" />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <span className="badge badge-primary">{product.category}</span>
                    <div className="product-price">{formatPrice(product.price)}</div>
                    <div className={`stock-info ${product.quantity < 5 ? 'low-stock' : ''}`}>
                      {product.quantity} in stock
                    </div>
                    {product.offers && (
                      <div className="offer-box">🎁 {product.offers}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary">No products available at this store.</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .store-container {
          padding: var(--space-2xl) var(--space-lg);
        }

        .store-info {
          padding: var(--space-2xl);
          margin-bottom: var(--space-2xl);
        }

        .store-info h1 {
          margin-bottom: var(--space-md);
        }

        .rating-large {
          font-size: 1.5rem;
          color: var(--warning);
          margin-bottom: var(--space-xl);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
        }

        .info-item {
          display: flex;
          gap: var(--space-md);
          align-items: flex-start;
        }

        .info-icon {
          font-size: 2rem;
        }

        .info-label {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: var(--space-xs);
        }

        .info-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .map-section, .products-section {
          margin-bottom: var(--space-2xl);
        }

        .map-section h2, .products-section h2 {
          margin-bottom: var(--space-lg);
        }

        .map-wrapper {
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-lg);
        }

        .product-card {
          padding: 0;
          overflow: hidden;
        }

        .product-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-info {
          padding: var(--space-lg);
        }

        .product-info h3 {
          font-size: 1.125rem;
          margin-bottom: var(--space-sm);
        }

        .product-price {
          font-size: 1.75rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: var(--space-md) 0;
        }

        .stock-info {
          color: var(--success);
          font-weight: 600;
          margin-bottom: var(--space-sm);
        }

        .stock-info.low-stock {
          color: var(--warning);
        }

        .offer-box {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-top: var(--space-sm);
        }

        .loading-screen, .error-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
