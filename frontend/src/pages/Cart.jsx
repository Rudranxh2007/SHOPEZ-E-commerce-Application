import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import CartItem from '../components/CartItem';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await API.delete('/cart/remove', { data: { productId } });
      } else {
        await API.put('/cart/update', { productId, quantity });
      }
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete('/cart/remove', { data: { productId } });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const getTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading)
    return (
      <div className="page-wrapper text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 className="fw-bold mb-4 animate-in">
          <i className="bi bi-cart3 me-2" style={{ color: 'var(--primary)' }}></i>
          Your Cart
        </h2>

        {!cart?.items?.length ? (
          <div className="text-center py-5 animate-in" style={{ color: 'var(--text-secondary)' }}>
            <i className="bi bi-cart-x" style={{ fontSize: '4rem' }}></i>
            <p className="mt-3 fs-5">Your cart is empty</p>
            <button className="btn btn-primary-shopez mt-2" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="animate-in">
            {cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdate={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            {/* Total & Checkout */}
            <div
              className="p-4 mt-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-semibold">Total</span>
                <span className="fs-4 fw-bold" style={{ color: 'var(--accent)' }}>
                  ${getTotal().toFixed(2)}
                </span>
              </div>
              <button
                className="btn btn-accent-shopez w-100 btn-lg"
                onClick={() => navigate('/checkout')}
              >
                <i className="bi bi-lock me-2"></i>Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
