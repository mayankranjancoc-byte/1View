import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRetailerProducts, syncOfflineSale } from '../services/api';

export default function OfflineBilling({ retailer }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        // Load sales from localStorage
        const storedSales = localStorage.getItem('recentSales');
        if (storedSales) {
            setSales(JSON.parse(storedSales));
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const storedRetailer = retailer || JSON.parse(localStorage.getItem('retailer'));
            if (!storedRetailer) {
                navigate('/retailer/login');
                return;
            }

            const data = await getRetailerProducts(storedRetailer.store.id);
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const storedRetailer = retailer || JSON.parse(localStorage.getItem('retailer'));
            const product = products.find(p => p.id === selectedProduct);

            if (!product) {
                setMessage({ type: 'error', text: 'Please select a product' });
                setLoading(false);
                return;
            }

            if (quantity > product.quantity) {
                setMessage({ type: 'error', text: 'Insufficient stock available' });
                setLoading(false);
                return;
            }

            const result = await syncOfflineSale(storedRetailer.store.id, selectedProduct, parseInt(quantity));

            // Add to recent sales
            const newSale = {
                ...result.sale,
                productName: product.name,
                price: product.price,
                timestamp: new Date().toISOString()
            };

            const updatedSales = [newSale, ...sales].slice(0, 10); // Keep last 10
            setSales(updatedSales);
            localStorage.setItem('recentSales', JSON.stringify(updatedSales));

            setMessage({
                type: 'success',
                text: `✅ Sale recorded successfully! Bill ID: ${result.sale.billId}. Stock updated: ${result.updatedProduct.quantity} remaining.`
            });

            // Reset form
            setSelectedProduct('');
            setQuantity(1);

            // Refresh products to show updated stock
            fetchProducts();

        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const selectedProductData = products.find(p => p.id === selectedProduct);

    return (
        <div className="offline-billing">
            <nav className="navbar retailer-nav">
                <div className="container navbar-content">
                    <div className="logo" onClick={() => navigate('/retailer/dashboard')} style={{ cursor: 'pointer' }}>
                        🏪 Offline Billing
                    </div>
                    <button onClick={() => navigate('/retailer/dashboard')} className="btn btn-secondary">
                        ← Dashboard
                    </button>
                </div>
            </nav>

            <div className="container billing-container">
                <div className="billing-grid">
                    {/* Billing Form */}
                    <div className="glass-card billing-form">
                        <h2>Record Offline Sale</h2>
                        <p className="form-description">
                            Enter details of offline sales to automatically sync inventory and track analytics.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Select Product</label>
                                <select
                                    className="input"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a product --</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} (Stock: {product.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedProductData && (
                                <div className="product-preview">
                                    <img src={selectedProductData.image} alt={selectedProductData.name} />
                                    <div>
                                        <div className="preview-name">{selectedProductData.name}</div>
                                        <div className="preview-price">₹{selectedProductData.price.toLocaleString('en-IN')}</div>
                                        <div className="preview-stock">
                                            Available: {selectedProductData.quantity} units
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Quantity Sold</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="1"
                                    max={selectedProductData?.quantity || 999}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>

                            {selectedProductData && (
                                <div className="total-amount">
                                    <span>Total Amount:</span>
                                    <span className="amount">₹{(selectedProductData.price * quantity).toLocaleString('en-IN')}</span>
                                </div>
                            )}

                            {message.text && (
                                <div className={`message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <button type="submit" className="btn btn-success" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Processing...' : '💳 Record Sale & Update Stock'}
                            </button>
                        </form>
                    </div>

                    {/* Recent Sales */}
                    <div className="glass-card sales-history">
                        <h2>Recent Sales</h2>
                        {sales.length === 0 ? (
                            <p className="text-secondary">No sales recorded yet</p>
                        ) : (
                            <div className="sales-list">
                                {sales.map((sale, index) => (
                                    <div key={index} className="sale-item">
                                        <div className="sale-header">
                                            <span className="bill-id">{sale.billId}</span>
                                            <span className="sale-time">
                                                {new Date(sale.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="sale-product">{sale.productName}</div>
                                        <div className="sale-details">
                                            <span>Qty: {sale.quantity}</span>
                                            <span className="sale-amount">
                                                ₹{(sale.price * sale.quantity).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .retailer-nav {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
        }

        .billing-container {
          padding: var(--space-2xl) var(--space-lg);
        }

        .billing-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-2xl);
        }

        .billing-form, .sales-history {
          padding: var(--space-2xl);
        }

        .billing-form h2, .sales-history h2 {
          margin-bottom: var(--space-md);
        }

        .form-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-xl);
        }

        .input, select.input {
          background: var(--surface);
          cursor: pointer;
        }

        .product-preview {
          display: flex;
          gap: var(--space-md);
          padding: var(--space-lg);
          background: var(--surface);
          border-radius: var(--radius-md);
          margin: var(--space-md) 0;
        }

        .product-preview img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .preview-name {
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .preview-price {
          color: var(--success);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: var(--space-xs);
        }

        .preview-stock {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
          border-radius: var(--radius-md);
          margin: var(--space-lg) 0;
        }

        .amount {
          font-size: 2rem;
          font-weight: 700;
          color: var(--success);
        }

        .message {
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-md);
        }

        .message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .sales-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .sale-item {
          padding: var(--space-md);
          background: var(--surface);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sale-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .bill-id {
          font-weight: 600;
          color: var(--primary-color);
        }

        .sale-time {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .sale-product {
          font-weight: 500;
          margin-bottom: var(--space-sm);
        }

        .sale-details {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
        }

        .sale-amount {
          color: var(--success);
          font-weight: 700;
        }

        @media (max-width: 968px) {
          .billing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
