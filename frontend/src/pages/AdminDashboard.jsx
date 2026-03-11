import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product form
  const emptyProduct = { name: '', description: '', price: '', category: '', image: '', stock: '' };
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analyticsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/products'),
        API.get('/admin/orders'),
        API.get('/admin/users'),
      ]);
      setAnalytics(analyticsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Product CRUD ----
  const handleProductChange = (e) =>
    setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormMsg('');
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };
      if (editingId) {
        await API.put(`/admin/products/${editingId}`, payload);
        setFormMsg('Product updated!');
      } else {
        await API.post('/admin/products', payload);
        setFormMsg('Product added!');
      }
      setProductForm(emptyProduct);
      setEditingId(null);
      fetchAll();
    } catch (err) {
      setFormMsg(err.response?.data?.message || 'Error');
    }
  };

  const editProduct = (p) => {
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image || '',
      stock: p.stock,
    });
    setEditingId(p._id);
    setTab('products');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Order status update ----
  const updateOrderStatus = async (id, orderStatus) => {
    try {
      await API.put(`/admin/orders/${id}`, { orderStatus });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Chart data ----
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesChartData = {
    labels: analytics?.monthlySales?.map((m) => `${monthNames[m._id.month - 1]} ${m._id.year}`) || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: analytics?.monthlySales?.map((m) => m.totalSales) || [],
        backgroundColor: 'rgba(108, 92, 231, 0.6)',
        borderColor: '#6c5ce7',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const orderStatusData = {
    labels: analytics?.ordersByStatus?.map((s) => s._id) || [],
    datasets: [
      {
        data: analytics?.ordersByStatus?.map((s) => s.count) || [],
        backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#b2b2cc' } },
    },
    scales: {
      x: { ticks: { color: '#b2b2cc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#b2b2cc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  if (loading)
    return (
      <div className="page-wrapper text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
      </div>
    );

  const tabs = [
    { key: 'overview', icon: 'bi-speedometer2', label: 'Overview' },
    { key: 'products', icon: 'bi-box-seam', label: 'Products' },
    { key: 'orders', icon: 'bi-receipt', label: 'Orders' },
    { key: 'users', icon: 'bi-people', label: 'Users' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container-fluid px-4">
        <h2 className="fw-bold mb-4 animate-in">
          <i className="bi bi-speedometer2 me-2" style={{ color: 'var(--primary)' }}></i>
          Admin Dashboard
        </h2>

        {/* Tab Navigation */}
        <div className="d-flex gap-2 mb-4 flex-wrap animate-in">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`btn ${tab === t.key ? 'btn-primary-shopez' : 'btn-outline-light'}`}
              onClick={() => setTab(t.key)}
            >
              <i className={`bi ${t.icon} me-1`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* ============ OVERVIEW ============ */}
        {tab === 'overview' && (
          <div className="animate-in">
            {/* Stat Cards */}
            <div className="row g-4 mb-5">
              {[
                { label: 'Total Revenue', value: `$${analytics?.totalRevenue?.toFixed(2) || '0.00'}`, icon: 'bi-cash-stack' },
                { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: 'bi-bag-check' },
                { label: 'Total Products', value: analytics?.totalProducts || 0, icon: 'bi-box-seam' },
                { label: 'Total Users', value: analytics?.totalUsers || 0, icon: 'bi-people' },
              ].map((s, i) => (
                <div className="col-sm-6 col-lg-3" key={i}>
                  <div className="stat-card">
                    <i className={`bi ${s.icon} mb-2`} style={{ fontSize: '1.5rem', color: 'var(--primary-light)' }}></i>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="row g-4">
              <div className="col-md-8">
                <div
                  className="p-4"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                >
                  <h5 className="fw-semibold mb-3">Monthly Sales</h5>
                  {analytics?.monthlySales?.length ? (
                    <Bar data={salesChartData} options={chartOptions} />
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No sales data yet</p>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className="p-4"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                >
                  <h5 className="fw-semibold mb-3">Orders by Status</h5>
                  {analytics?.ordersByStatus?.length ? (
                    <Doughnut
                      data={orderStatusData}
                      options={{ responsive: true, plugins: { legend: { labels: { color: '#b2b2cc' } } } }}
                    />
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ PRODUCTS ============ */}
        {tab === 'products' && (
          <div className="animate-in">
            {/* Add / Edit Form */}
            <div
              className="p-4 mb-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            >
              <h5 className="fw-semibold mb-3">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h5>
              {formMsg && <div className="alert alert-info py-2">{formMsg}</div>}
              <form onSubmit={handleProductSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input name="name" className="form-control form-control-shopez" placeholder="Product Name" value={productForm.name} onChange={handleProductChange} required />
                  </div>
                  <div className="col-md-3">
                    <input name="price" type="number" step="0.01" className="form-control form-control-shopez" placeholder="Price" value={productForm.price} onChange={handleProductChange} required />
                  </div>
                  <div className="col-md-3">
                    <input name="stock" type="number" className="form-control form-control-shopez" placeholder="Stock" value={productForm.stock} onChange={handleProductChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="category" className="form-control form-control-shopez" placeholder="Category" value={productForm.category} onChange={handleProductChange} required />
                  </div>
                  <div className="col-md-8">
                    <input name="image" className="form-control form-control-shopez" placeholder="Image URL" value={productForm.image} onChange={handleProductChange} />
                  </div>
                  <div className="col-12">
                    <textarea name="description" className="form-control form-control-shopez" rows="2" placeholder="Description" value={productForm.description} onChange={handleProductChange} required></textarea>
                  </div>
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-primary-shopez" type="submit">
                      <i className={`bi ${editingId ? 'bi-pencil' : 'bi-plus-circle'} me-1`}></i>
                      {editingId ? 'Update' : 'Add Product'}
                    </button>
                    {editingId && (
                      <button
                        className="btn btn-outline-light"
                        type="button"
                        onClick={() => { setEditingId(null); setProductForm(emptyProduct); }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="table-responsive">
              <table className="table table-shopez">
                <thead>
                  <tr>
                    <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.image || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                      </td>
                      <td>{p.name}</td>
                      <td><span className="badge-shopez" style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--primary-light)' }}>{p.category}</span></td>
                      <td style={{ color: 'var(--accent)' }}>${p.price?.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-light me-1" onClick={() => editProduct(p)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p._id)}>
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p className="text-center py-3" style={{ color: 'var(--text-secondary)' }}>No products yet</p>
              )}
            </div>
          </div>
        )}

        {/* ============ ORDERS ============ */}
        {tab === 'orders' && (
          <div className="animate-in">
            <div className="table-responsive">
              <table className="table table-shopez">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td><small>#{o._id.slice(-8).toUpperCase()}</small></td>
                      <td>{o.user?.name || 'N/A'}<br /><small style={{ color: 'var(--text-secondary)' }}>{o.user?.email}</small></td>
                      <td>{o.items?.length} item(s)</td>
                      <td style={{ color: 'var(--accent)' }}>${o.totalPrice?.toFixed(2)}</td>
                      <td>
                        <select
                          className="form-select form-select-sm form-control-shopez"
                          value={o.orderStatus}
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          style={{ width: 140 }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td><small>{new Date(o.createdAt).toLocaleDateString()}</small></td>
                      <td>
                        <span className={`badge bg-${o.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>{o.paymentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="text-center py-3" style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
              )}
            </div>
          </div>
        )}

        {/* ============ USERS ============ */}
        {tab === 'users' && (
          <div className="animate-in">
            <div className="table-responsive">
              <table className="table table-shopez">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge bg-${u.role === 'ADMIN' ? 'danger' : 'primary'}`}>{u.role}</span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center py-3" style={{ color: 'var(--text-secondary)' }}>No users yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
