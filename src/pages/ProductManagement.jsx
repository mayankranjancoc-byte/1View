import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRetailerProducts, addProduct, updateProduct, deleteProduct } from '../services/api';

export default function ProductManagement({ retailer }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        image: '',
        offers: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
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
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedRetailer = retailer || JSON.parse(localStorage.getItem('retailer'));

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await addProduct({ ...formData, storeId: storedRetailer.store.id });
            }

            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: '', quantity: '', image: '', offers: '' });
            fetchProducts();
        } catch (err) {
            alert('Error saving product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            offers: product.offers || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            alert('Error deleting product');
        }
    };

    return (
        <div className="product-management">
            <nav className="navbar retailer-nav">
                <div className="container navbar-content">
                    <div className="logo" onClick={() => navigate('/retailer/dashboard')} style={{ cursor: 'pointer' }}>
                        🏪 Product Management
                    </div>
                    <button onClick={() => navigate('/retailer/dashboard')} className="btn btn-secondary">
                        ← Dashboard
                    </button>
                </div>
            </nav>

            <div className="container pm-container">
                <div className="pm-header">
                    <h1>Products ({products.length})</h1>
                    <button onClick={() => {
                        setShowForm(true);
                        setEditingProduct(null);
                        setFormData({ name: '', category: '', price: '', quantity: '', image: '', offers: '' });
                    }} className="btn btn-success">
                        ➕ Add Product
                    </button>
                </div>

                {showForm && (
                    <div className="form-overlay">
                        <div className="glass-card form-modal">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label className="input-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label className="input-label">Category</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Price (₹)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Image URL</label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Offers (Optional)</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g., 10% off this weekend"
                                        value={formData.offers}
                                        onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        {editingProduct ? 'Update' : 'Add'} Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="products-grid">
                    {loading ? (
                        <div className="spinner"></div>
                    ) : products.length === 0 ? (
                        <p>No products yet. Click "Add Product" to get started!</p>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="glass-card product-card">
                                <img src={product.image} alt={product.name} className="product-img" />
                                <div className="product-details">
                                    <h3>{product.name}</h3>
                                    <span className="badge badge-primary">{product.category}</span>
                                    <div className="product-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Price:</span>
                                            <span className="meta-value">₹{product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Stock:</span>
                                            <span className={`meta-value ${product.quantity < 5 ? 'low-stock' : ''}`}>
                                                {product.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    {product.offers && (
                                        <div className="offer-info">🎁 {product.offers}</div>
                                    )}
                                    <div className="card-actions">
                                        <button onClick={() => handleEdit(product)} className="btn btn-secondary btn-sm">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="btn btn-secondary btn-sm delete-btn">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
        .retailer-nav {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
        }

        .pm-container {
          padding: var(--space-2xl) var(--space-lg);
        }

        .pm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2xl);
        }

        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-lg);
        }

        .form-modal {
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-2xl);
        }

        .form-modal h2 {
          margin-bottom: var(--space-xl);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }

        .form-actions {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-xl);
        }

        .form-actions button {
          flex: 1;
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

        .product-details {
          padding: var(--space-lg);
        }

        .product-details h3 {
          margin-bottom: var(--space-sm);
        }

        .product-meta {
          margin: var(--space-md) 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
        }

        .meta-label {
          color: var(--text-muted);
        }

        .meta-value {
          font-weight: 600;
        }

        .meta-value.low-stock {
          color: var(--warning);
        }

        .offer-info {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-bottom: var(--space-md);
        }

        .card-actions {
          display: flex;
          gap: var(--space-sm);
        }

        .card-actions button {
          flex: 1;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
        }

        @media (max-width: 768px) {
          .pm-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
