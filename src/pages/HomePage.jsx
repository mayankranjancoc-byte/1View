import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/api';

export default function HomePage({ userLocation, setUserLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('detecting');
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('success');
        },
        (error) => {
          // Fallback to default Delhi location
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          setLocationStatus('default');
        }
      );
    } else if (userLocation) {
      setLocationStatus('success');
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const location = userLocation || { lat: 28.6139, lng: 77.2090 };
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&lat=${location.lat}&lng=${location.lng}`);
  };

  const quickSearch = (query) => {
    setSearchQuery(query);
    const location = userLocation || { lat: 28.6139, lng: 77.2090 };
    navigate(`/search?q=${encodeURIComponent(query)}&lat=${location.lat}&lng=${location.lng}`);
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo">
            <img src="/logo.png" alt="1View" />
          </div>
          <ul className="nav-links">
            <li><a href="/" className="nav-link">Home</a></li>
            <li><a href="/retailer/login" className="nav-link">Retailer Login</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find the <span className="text-gradient">Best Deals</span><br />
              at Nearby Stores
            </h1>
            <p className="hero-subtitle">
              Real-time price comparison across physical stores near you.<br />
              Save money. Save time. Shop smarter.
            </p>

            {/* Location Status */}
            <div className="location-badge">
              {locationStatus === 'detecting' && (
                <span className="badge badge-warning">📍 Detecting your location...</span>
              )}
              {locationStatus === 'success' && (
                <span className="badge badge-success">📍 Location detected</span>
              )}
              {locationStatus === 'default' && (
                <span className="badge badge-primary">📍 Using default location (Delhi)</span>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar mt-xl">
              <div className="search-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search for products (e.g., iPhone, MacBook, Headphones)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}>
                Search
              </button>
            </form>

            {/* Quick Search Buttons */}
            <div className="quick-search mt-lg">
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Popular searches:</p>
              <div className="flex gap-md" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => quickSearch('iPhone')} className="btn btn-secondary">📱 iPhone</button>
                <button onClick={() => quickSearch('MacBook')} className="btn btn-secondary">💻 MacBook</button>
                <button onClick={() => quickSearch('Headphones')} className="btn btn-secondary">🎧 Headphones</button>
                <button onClick={() => quickSearch('Samsung')} className="btn btn-secondary">📱 Samsung</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="suggestions-section">
        <div className="container">
          <h2 className="text-center mb-xl">What's on your mind?</h2>
          <div className="grid grid-3 suggestions-grid">
            <div className="glass-card suggestion-card" onClick={() => quickSearch('Smartphones')}>
              <div className="suggestion-icon">📱</div>
              <h3>Smartphones</h3>
              <p>iPhones, Samsung & more</p>
            </div>
            <div className="glass-card suggestion-card" onClick={() => quickSearch('Laptops')}>
              <div className="suggestion-icon">💻</div>
              <h3>Laptops</h3>
              <p>MacBooks, Dell XPS & more</p>
            </div>
            <div className="glass-card suggestion-card" onClick={() => quickSearch('Audio')}>
              <div className="suggestion-icon">🎧</div>
              <h3>Audio</h3>
              <p>Headphones, Earbuds & more</p>
            </div>
            <div className="glass-card suggestion-card" onClick={() => quickSearch('Accessories')}>
              <div className="suggestion-icon">🔌</div>
              <h3>Accessories</h3>
              <p>Cables, Chargers & Cases</p>
            </div>
            <div className="glass-card suggestion-card" onClick={() => quickSearch('Stationery')}>
              <div className="suggestion-icon">✏️</div>
              <h3>Stationery</h3>
              <p>Notebooks, Pens & Office Supplies</p>
            </div>
            <div className="glass-card suggestion-card" onClick={() => quickSearch('General')}>
              <div className="suggestion-icon">🎒</div>
              <h3>General Essentials</h3>
              <p>Bottles, Batteries & Daily Needs</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .hero {
          padding: var(--space-2xl) 0;
          min-height: 80vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s ease-in-out infinite;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 15s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(10deg); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          margin-bottom: var(--space-lg);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-xl);
        }

        .location-badge {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-md);
        }

        .search-bar {
          position: relative;
          max-width: 700px;
          margin: 0 auto;
        }

        .quick-search {
          text-align: center;
        }

        .suggestions-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        }

        .suggestions-grid {
          gap: var(--space-xl);
        }

        .suggestion-card {
          text-align: center;
          padding: var(--space-xl);
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .suggestion-card:hover {
          transform: translateY(-8px);
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--primary-color);
        }

        .suggestion-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity var(--transition-base);
        }

        .suggestion-card:hover::after {
          opacity: 1;
        }

        .suggestion-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
          display: inline-block;
          transition: transform var(--transition-base);
        }

        .suggestion-card:hover .suggestion-icon {
          transform: scale(1.1);
        }

        .suggestion-card h3 {
          margin-bottom: var(--space-sm);
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .suggestion-card p {
          color: var(--text-secondary);
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }

          .suggestions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .suggestions-grid {
             grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
