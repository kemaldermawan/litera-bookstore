const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth'); // pastikan middleware auth ada

// Tampilkan cart
router.get('/cart', cartController.getCart);

// Tambah ke cart
router.post('/cart/add/:id', cartController.addToCart);

// Update cart (opsional)
router.post('/cart/update', cartController.updateCart);

// Hapus 1 item dari cart
router.post('/cart/delete/:id', cartController.deleteItem);

module.exports = router;
