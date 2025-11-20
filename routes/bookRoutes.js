const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Rute Halaman Utama
router.get('/store', bookController.getAllBooks);

router.get('/store/book/:id', bookController.getBookDetail);

router.get('/', (req, res) => {
    res.redirect('/store');
});

module.exports = router;