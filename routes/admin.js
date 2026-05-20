const express = require('express');
const router = express.Router();
const adminBookController = require('../controllers/adminBookController');
const upload = require('../config/multerConfig');
const { isAdmin } = require('../middleware/auth');

/**
 * Global Administrative Route Protection
 * This injects the isAdmin middleware gatekeeper across all subsequent route endpoints
 * defined inside this file wrapper layout.
 */
router.use(isAdmin);

// --- ADMINISTRATIVE DASHBOARD VIEWS ---

// GET: Render the core administrative operations and inventory dashboard panel
// Diakses melalui URL: http://localhost:3000/admin/dashboard
router.get('/dashboard', adminBookController.getDashboard);

// GET: Render the dedicated asset editing workspace for a specific book entity
// Diakses melalui URL: http://localhost:3000/admin/books/edit/:id
router.get('/books/edit/:id', adminBookController.getEditBook);


// --- INVENTORY MANAGEMENT MUTATION PROTOCOLS ---

// POST: Process inbound form fields and cover imagery binary to create a new book document
router.post('/books/create', upload, adminBookController.createBook);

// POST: Update text configurations or override current cover path reference maps for a book
router.post('/books/update/:id', upload, adminBookController.updateBook);

// POST: Securely drop a targeted book instance from the active MongoDB inventory collection
router.post('/books/delete/:id', adminBookController.deleteBook);


// --- ASYNCHRONOUS DATA STREAM FEEDING PIPELINES (AJAX API) ---

// GET: Stream structured historical pickup order reservation lists to admin tables
// Diakses melalui URL: http://localhost:3000/admin/data/transactions
router.get('/data/transactions', adminBookController.getTransactions);

// GET: Stream user text ratings and feedback matrices to administrative review logs
// Diakses melalui URL: http://localhost:3000/admin/data/reviews
router.get('/data/reviews', adminBookController.getReviews);


// --- ADMINISTRATIVE MODERATION ACTIONS (AJAX POST) ---

// POST: Update order status to Completed via Admin Control trigger
// PERBAIKAN: Menghapus kata '/admin' di depan agar tidak memicu rute ganda (/admin/admin/...)
router.post('/orders/complete/:id', adminBookController.completeOrder);

// POST: Delete customer review via Admin moderation panel
// PERBAIKAN: Menghapus kata '/admin' di depan agar sinkron dengan Fetch API frontend
router.post('/reviews/delete/:id', adminBookController.deleteReview);

module.exports = router;