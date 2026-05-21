const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');
const checkoutController = require('../controllers/checkoutController');
const Review = require('../models/Review');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { isLoggedIn, mustCompleteProfile } = require('../middleware/auth');

// --- 1. PROTOKOL RUTE SUKSES ORDER ---
router.get('/order-success/:id', isLoggedIn, async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId)
            .populate('items.book', 'title coverImage')
            .lean();

        if (!order) {
            return res.redirect('/store?error=Order record could not be found.');
        }

        res.render('pages/orderSuccess', {
            pageTitle: 'Order Success - Litera Bookstore',
            order
        });
    } catch (err) {
        console.error('Runtime exception displaying order success layout:', err);
        res.redirect('/store?error=Internal processing error loading success node.');
    }
});

// --- 2. BOOK CATALOG INTERFACE ENDPOINTS ---
router.get('/', (req, res) => res.redirect('/store'));
router.get('/store', bookController.getAllBooks);
router.get('/store/book/:id', bookController.getBookDetail);
router.get('/search', bookController.searchBooks);

// --- 3. SHOPPING BASKET ROUTING PROTOCOLS ---
router.get('/cart', cartController.getCart);
router.post('/cart/add/:id', cartController.addToCart);
router.post('/cart/update', cartController.updateCart);
router.get('/cart/delete/:id', cartController.deleteItem);

// --- 4. CLICK & COLLECT IN-STORE CHECKOUT PROTOCOLS ---
router.get('/checkout', isLoggedIn, mustCompleteProfile, checkoutController.checkoutCart);
router.post('/checkout', isLoggedIn, mustCompleteProfile, checkoutController.createOrder);

// --- 5. PUBLIC PRODUCT REVIEW WORKFLOWS (DEDICATED INTERFACE INTEGRATION) ---
router.get('/review/:id', isLoggedIn, async (req, res) => {
    try {
        const bookId = req.params.id;
        const sessionUser = req.session.user;

        const book = await Book.findById(bookId).lean();
        if (!book) {
            return res.redirect('/auth/profile?error=Asset profile not found.');
        }

        // Proteksi Gerbang Keamanan: Validasi kepemilikan transaksi faktur 'Completed' sebelum merender form
        const verifiedPurchase = await Order.findOne({
            user: sessionUser.id,
            status: 'Completed',
            'items.book': bookId
        }).lean();

        if (!verifiedPurchase) {
            return res.redirect(`/store/book/${bookId}?error=Review operational authorization restricted.`);
        }

        res.render('pages/review', { 
            pageTitle: `Write Review: ${book.title} - Litera`, 
            book,
            user: sessionUser
        });
    } catch (err) {
        console.error('Runtime exception displaying evaluation layout:', err);
        res.redirect('/auth/profile?error=Operational runtime exception.');
    }
});

router.post('/review/:id', isLoggedIn, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const bookId = req.params.id;
        const sessionUser = req.session.user; 

        const newReview = new Review({
            book: bookId,
            user: sessionUser.id,
            username: sessionUser.username,
            rating: Number(rating),
            comment
        });
        await newReview.save();

        const reviews = await Review.find({ book: bookId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (numReviews || 1);

        await Book.findByIdAndUpdate(bookId, {
            numReviews,
            averageRating: Math.round(avgRating * 10) / 10 
        });

        res.redirect(`/store/book/${bookId}`);
    } catch (err) {
        console.error('Critical failure handling public item review persistence:', err);
        res.status(500).send('Internal Server Error processing review submission.');
    }
});

module.exports = router;