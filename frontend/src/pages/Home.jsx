import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort) params.sort = sort;
      const { data } = await API.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error('API failed, using mock data:', err.message);
      // Mock data so UI works without DB
      const mockProducts = [
        {
          _id: '1',
          name: 'Wireless Noise-Canceling Headphones',
          category: 'Electronics',
          price: 299.99,
          rating: 4.8,
          numReviews: 124,
          stock: 15,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
          description: 'Premium wireless headphones with active noise cancellation.'
        },
        {
          _id: '2',
          name: 'Minimalist Smartwatch',
          category: 'Electronics',
          price: 199.50,
          rating: 4.5,
          numReviews: 89,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
          description: 'Sleek smartwatch with health tracking features.'
        },
        {
          _id: '3',
          name: 'Eco-Friendly Water Bottle',
          category: 'Home',
          price: 35.00,
          rating: 4.9,
          numReviews: 210,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
          description: 'Insulated stainless steel water bottle, keeps drinks cold for 24h.'
        },
        {
          _id: '4',
          name: 'Ergonomic Office Chair',
          category: 'Home',
          price: 149.99,
          rating: 4.6,
          numReviews: 56,
          stock: 8,
          image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80',
          description: 'Comfortable mesh office chair with lumbar support.'
        }
      ];
      
      // Basic filtering for mock data
      let filtered = mockProducts;
      if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      if (category) filtered = filtered.filter(p => p.category === category);
      if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
      if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Hero */}
        <div className="text-center mb-5 animate-in">
          <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
            Welcome to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ShopEZ
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Discover amazing products at unbeatable prices
          </p>
        </div>

        {/* Search & Filter */}
        <div className="row g-3 mb-4 animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="col-md-5">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-shopez"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary-shopez" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
          <div className="col-md-4">
            <select
              className="form-select form-control-shopez"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select form-control-shopez"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
            <i className="bi bi-box-seam" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3">No products found</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product, i) => (
              <div
                className="col-sm-6 col-md-4 col-lg-3"
                key={product._id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
