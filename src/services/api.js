const API_BASE_URL = 'http://localhost:3001/api';

export const searchProducts = async (query, lat, lng) => {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
};

export const getStores = async () => {
    const response = await fetch(`${API_BASE_URL}/stores`);
    if (!response.ok) throw new Error('Failed to fetch stores');
    return response.json();
};

export const getStoreById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`);
    if (!response.ok) throw new Error('Failed to fetch store');
    return response.json();
};

export const loginRetailer = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const getRetailerProducts = async (storeId) => {
    const response = await fetch(`${API_BASE_URL}/retailer/products/${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const addProduct = async (product) => {
    const response = await fetch(`${API_BASE_URL}/retailer/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to add product');
    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/retailer/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/retailer/products/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
};

export const syncOfflineSale = async (storeId, productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/sales/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to sync sale');
    return response.json();
};

export const getTrendingProducts = async (storeId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/trending/${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch trending products');
    return response.json();
};

export const getTopSearches = async (storeId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/searches/${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch searches');
    return response.json();
};

export const getDemandAnalysis = async (storeId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/demand/${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch demand data');
    return response.json();
};

export const getStockSuggestions = async (storeId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/suggestions/${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    return response.json();
};
