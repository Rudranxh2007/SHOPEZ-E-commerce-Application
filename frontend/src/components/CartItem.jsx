import React from 'react';

const CartItem = ({ item, onUpdate, onRemove }) => {
  const product = item.product;
  if (!product) return null;

  return (
    <div
      className="d-flex align-items-center p-3 mb-3"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
      }}
    >
      <img
        src={product.image || 'https://via.placeholder.com/80'}
        alt={product.name}
        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
      />
      <div className="ms-3 flex-grow-1">
        <h6 className="mb-1 fw-semibold">{product.name}</h6>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
          ${product.price?.toFixed(2)}
        </span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => onUpdate(product._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <i className="bi bi-dash"></i>
        </button>
        <span className="fw-bold" style={{ minWidth: 28, textAlign: 'center' }}>
          {item.quantity}
        </span>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => onUpdate(product._id, item.quantity + 1)}
        >
          <i className="bi bi-plus"></i>
        </button>
        <button
          className="btn btn-sm text-danger ms-2"
          onClick={() => onRemove(product._id)}
        >
          <i className="bi bi-trash3"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
