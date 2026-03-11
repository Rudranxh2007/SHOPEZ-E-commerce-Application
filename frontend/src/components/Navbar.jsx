import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('shopez_user') || 'null');

  const logout = () => {
    localStorage.removeItem('shopez_user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-shopez sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-bag-heart-fill me-2"></i>ShopEZ
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem', color: '#f1f1f1' }}></i>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <i className="bi bi-cart3 me-1"></i>Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    <i className="bi bi-receipt me-1"></i>Orders
                  </Link>
                </li>
                {user.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      <i className="bi bi-speedometer2 me-1"></i>Admin
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <li>
                    <button
                      className="dropdown-item text-light"
                      style={{ background: 'transparent' }}
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
