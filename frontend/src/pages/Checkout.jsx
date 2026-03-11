import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        if (!data?.items?.length) return navigate('/cart');
        setCart(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const getTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  };

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/orders', { shippingAddress: address });
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart)
    return (
      <div className="page-wrapper text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <h2 className="fw-bold mb-4 animate-in">
          <i className="bi bi-credit-card me-2" style={{ color: 'var(--primary)' }}></i>
          Checkout
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4 animate-in">
          {/* Shipping Form */}
          <div className="col-md-7">
            <div
              className="p-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <h5 className="fw-semibold mb-3">
                <i className="bi bi-geo-alt me-2"></i>Shipping Address
              </h5>
              <form onSubmit={placeOrder}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="street"
                    className="form-control form-control-shopez"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <input
                      type="text"
                      name="city"
                      className="form-control form-control-shopez"
                      placeholder="City"
                      value={address.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="state"
                      className="form-control form-control-shopez"
                      placeholder="State"
                      value={address.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <input
                      type="text"
                      name="zip"
                      className="form-control form-control-shopez"
                      placeholder="ZIP Code"
                      value={address.zip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="country"
                      className="form-control form-control-shopez"
                      placeholder="Country"
                      value={address.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button className="btn btn-accent-shopez w-100 btn-lg" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-check-circle me-2"></i>
                  )}
                  Place Order
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-5">
            <div
              className="p-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <h5 className="fw-semibold mb-3">
                <i className="bi bi-receipt me-2"></i>Order Summary
              </h5>
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between py-2"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span>
                    {item.product?.name}{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</span>
                  </span>
                  <span style={{ color: 'var(--accent)' }}>
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="d-flex justify-content-between pt-3 mt-2">
                <span className="fs-5 fw-bold">Total</span>
                <span className="fs-5 fw-bold" style={{ color: 'var(--accent)' }}>
                  ${getTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
