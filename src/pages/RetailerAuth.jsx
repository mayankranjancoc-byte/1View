import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRetailer } from '../services/api';

export default function RetailerAuth({ setRetailer }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginRetailer(email, password);
      setRetailer(data);
      localStorage.setItem('retailer', JSON.stringify(data));
      navigate('/retailer/dashboard');
    } catch (err) {
      setError('Invalid credentials. Try: techhub@example.com / demo123');
    } finally {
      setLoading(false);
    }
  };

  // Check for registration success
  const urlParams = new URLSearchParams(window.location.search);
  const registered = urlParams.get('registered');

  const quickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="auth-page">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="1View" />
          </div>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Customer View
          </button>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1>Retailer Login</h1>
            <p>Access your store dashboard and analytics</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {registered && (
              <div className="success-message">
                ✓ Registration successful! Please login with your credentials.
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-success" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="demo-accounts">
            <p className="demo-label">Demo Accounts (Click to use):</p>
            <div className="demo-buttons">
              <button onClick={() => quickLogin('techhub@example.com')} className="demo-btn">
                TechHub Electronics
              </button>
              <button onClick={() => quickLogin('store2@example.com')} className="demo-btn">
                Nehru Place Store
              </button>
              <button onClick={() => quickLogin('store3@example.com')} className="demo-btn">
                Lajpat Nagar Stationery
              </button>
            </div>
            <p className="demo-password">All demo passwords: <code>demo123</code></p>
          </div>

          <div className="signup-link">
            <p>Don't have an account? <a href="/retailer/signup" className="link">Register your store →</a></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .auth-container {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
        }

        .auth-card {
          max-width: 500px;
          width: 100%;
          padding: var(--space-2xl);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .auth-header h1 {
          background: var(--retailer-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--space-sm);
        }

        .auth-header p {
          color: var(--text-secondary);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
        }

        .demo-accounts {
          margin-top: var(--space-2xl);
          padding-top: var(--space-xl);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .demo-label {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: var(--space-md);
          text-align: center;
        }

        .demo-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .demo-btn {
          padding: var(--space-md);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: var(--text-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
          font-weight: 500;
        }

        .demo-btn:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
        }

        .demo-password {
          text-align: center;
          margin-top: var(--space-md);
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .demo-password code {
          background: var(--surface);
          padding: var(--space-xs) var(--space-sm);
          border-radius: 8px;
          cursor: pointer;
        }

        .signup-link {
          margin-top: 2rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .signup-link p {
          color: var(--text-secondary);
        }

        .signup-link .link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .signup-link .link:hover {
          opacity: 0.8;
        }

        .success-message {
          background: rgba(46, 204, 113, 0.1);
          border: 1px solid rgba(46, 204, 113, 0.3);
          color: #2ecc71;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
