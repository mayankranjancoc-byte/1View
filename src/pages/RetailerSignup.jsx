import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RetailerSignup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        storeAddress: '',
        phone: '',
        latitude: 28.6139,
        longitude: 77.2090
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.email || !formData.password) {
                setError('Please fill all fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
        }
        if (step === 2) {
            if (!formData.storeName || !formData.storeAddress || !formData.phone) {
                setError('Please fill all fields');
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Success - redirect to login
            navigate('/retailer/login?registered=true');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <nav className="navbar">
                <div className="container navbar-content">
                    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src="/logo.png" alt="1View" />
                    </div>
                    <button onClick={() => navigate('/retailer/login')} className="btn btn-secondary">
                        Login Instead
                    </button>
                </div>
            </nav>

            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <h1>Register Your Store</h1>
                        <p>Join 1View and manage your inventory online</p>
                        <div className="signup-steps">
                            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Account</div>
                            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Store Info</div>
                            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Review</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Account Details */}
                        {step === 1 && (
                            <>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="input"
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="input"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <button type="button" onClick={handleNext} className="btn btn-success" style={{ width: '100%' }}>
                                    Next →
                                </button>
                            </>
                        )}

                        {/* Step 2: Store Information */}
                        {step === 2 && (
                            <>
                                <div className="input-group">
                                    <label className="input-label">Store Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        className="input"
                                        placeholder="e.g., TechHub Electronics"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Store Address</label>
                                    <input
                                        type="text"
                                        name="storeAddress"
                                        className="input"
                                        placeholder="e.g., Connaught Place, Delhi"
                                        value={formData.storeAddress}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="input"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                                        ← Back
                                    </button>
                                    <button type="button" onClick={handleNext} className="btn btn-success" style={{ flex: 1 }}>
                                        Next →
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Review & Submit */}
                        {step === 3 && (
                            <>
                                <div className="review-section">
                                    <h3>Review Your Information</h3>
                                    <div className="review-item">
                                        <strong>Email:</strong> {formData.email}
                                    </div>
                                    <div className="review-item">
                                        <strong>Store Name:</strong> {formData.storeName}
                                    </div>
                                    <div className="review-item">
                                        <strong>Address:</strong> {formData.storeAddress}
                                    </div>
                                    <div className="review-item">
                                        <strong>Phone:</strong> {formData.phone}
                                    </div>
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1 }}>
                                        ← Back
                                    </button>
                                    <button type="submit" className="btn btn-success" style={{ flex: 1 }} disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Complete Registration'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            <style jsx>{`
                .signup-steps {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    justify-content: center;
                }

                .step {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    font-size: 0.9rem;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                }

                .step.active {
                    opacity: 1;
                    background: var(--primary-gradient);
                }

                .review-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                }

                .review-section h3 {
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }

                .review-item {
                    padding: 0.75rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                }

                .review-item:last-child {
                    border-bottom: none;
                }

                .review-item strong {
                    color: var(--text-primary);
                    display: inline-block;
                    min-width: 100px;
                }
            `}</style>
        </div>
    );
}
