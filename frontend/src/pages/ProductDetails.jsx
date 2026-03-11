import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem('shopez_user') || 'null');
    if (!user) return navigate('/login');
    setAdding(true);
    try {
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= Math.round(rating) ? '-fill star-filled' : ' star-empty'}`}
          style={{ fontSize: '1.2rem' }}
        ></i>
      );
    }
    return stars;
  };

  if (loading)
    return (
      <div className="page-wrapper text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
      </div>
    );

  if (!product)
    return (
      <div className="page-wrapper text-center py-5">
        <h4>Product not found</h4>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="btn btn-sm btn-outline-light mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
        <div className="row g-5 animate-in">
          {/* Image */}
          <div className="col-md-6">
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <img
                src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'}
                alt={product.name}
                style={{ width: '100%', height: 400, objectFit: 'cover' }}
              />
            </div>
          </div>
          {/* Info */}
          <div className="col-md-6">
            <span
              className="badge-shopez mb-3 d-inline-block"
              style={{ background: 'rgba(108,92,231,0.2)', color: 'var(--primary-light)' }}
            >
              {product.category}
            </span>
            <h2 className="fw-bold mb-2">{product.name}</h2>
            <div className="mb-3">
              {renderStars(product.rating)}
              <span className="ms-2" style={{ color: 'var(--text-secondary)' }}>
                {product.numReviews || 0} reviews
              </span>
            </div>
            <h3 style={{ color: 'var(--accent)' }} className="fw-bold mb-3">
              ${product.price?.toFixed(2)}
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {product.description}
            </p>
            <div className="d-flex align-items-center gap-3 mt-4 mb-3">
              <span
                className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            <button
              className="btn btn-accent-shopez btn-lg"
              onClick={addToCart}
              disabled={adding || product.stock <= 0}
            >
              {adding ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-cart-plus me-2"></i>
              )}
              Add to Cart
            </button>
            {message && (
              <div className="alert alert-info mt-3 py-2">{message}</div>
            )}

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-5">
                <h5 className="fw-semibold mb-3">
                  <i className="bi bi-chat-left-text me-2"></i>Customer Reviews
                </h5>
                {product.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="p-3 mb-3"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{review.name}</strong>
                      <div>{renderStars(review.rating)}</div>
                    </div>
                    <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
