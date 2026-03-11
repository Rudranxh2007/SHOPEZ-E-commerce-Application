const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getAnalytics,
} = require('../controllers/adminController');

// Product management
router.post('/products', protect, admin, addProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);

// Order management
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

// Users
router.get('/users', protect, admin, getAllUsers);

// Analytics
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
