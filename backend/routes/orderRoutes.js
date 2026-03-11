const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);

module.exports = router;
