import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= Math.round(rating) ? '-fill star-filled' : ' star-empty'}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="card-shopez h-100 animate-in">
      <img
        src={product.image || 'https://via.placeholder.com/300x220?text=No+Image'}
        alt={product.name}
      />
      <div className="p-3">
        <span
          className="badge-shopez mb-2 d-inline-block"
          style={{ background: 'rgba(108,92,231,0.2)', color: 'var(--primary-light)' }}
        >
          {product.category}
        </span>
        <h6 className="fw-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h6>
        <div className="mb-2" style={{ fontSize: '0.85rem' }}>
          {renderStars(product.rating)}
          <span className="ms-1 text-secondary">({product.numReviews || 0})</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold" style={{ fontSize: '1.15rem', color: 'var(--accent)' }}>
            ${product.price?.toFixed(2)}
          </span>
          <Link to={`/product/${product._id}`} className="btn btn-sm btn-primary-shopez">
            View <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        {product.stock <= 0 && (
          <span className="badge bg-danger mt-2">Out of Stock</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
