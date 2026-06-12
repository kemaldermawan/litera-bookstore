const express = require('express');
const router = express.Router();
const adminBookController = require('../controllers/adminBookController');
const upload = require('../config/multerConfig');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/dashboard', adminBookController.getDashboard);
router.get('/books/edit/:id', adminBookController.getEditBook);

router.post('/books/create', upload, adminBookController.createBook);
router.post('/books/update/:id', upload, adminBookController.updateBook);
router.post('/books/delete/:id', adminBookController.deleteBook);

router.get('/data/transactions', adminBookController.getTransactions);
router.get('/data/reviews', adminBookController.getReviews);

router.post('/orders/complete/:id', adminBookController.completeOrder);
router.post('/reviews/delete/:id', adminBookController.deleteReview);

module.exports = router;