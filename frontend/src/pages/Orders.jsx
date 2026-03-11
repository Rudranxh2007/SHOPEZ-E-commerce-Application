import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'Processing': return 'warning';
      case 'Shipped': return 'info';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading)
    return (
      <div className="page-wrapper text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <h2 className="fw-bold mb-4 animate-in">
          <i className="bi bi-receipt me-2" style={{ color: 'var(--primary)' }}></i>
          My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
            <i className="bi bi-bag" style={{ fontSize: '4rem' }}></i>
            <p className="mt-3 fs-5">No orders yet</p>
          </div>
        ) : (
          orders.map((order, i) => (
            <div
              key={order._id}
              className="p-4 mb-4 animate-in"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </small>
                  <br />
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <span className={`badge bg-${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span
                    className={`badge bg-${order.paymentStatus === 'Paid' ? 'success' : 'warning'}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items */}
              {order.items.map((item, j) => (
                <div
                  key={j}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="d-flex align-items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 45, height: 45, objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)', marginRight: 12,
                        }}
                      />
                    )}
                    <span>
                      {item.name}{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</span>
                    </span>
                  </div>
                  <span style={{ color: 'var(--accent)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div
                className="d-flex justify-content-between pt-3 mt-2"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span className="fw-bold">Total</span>
                <span className="fw-bold" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
