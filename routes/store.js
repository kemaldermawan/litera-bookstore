const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');
const checkoutController = require('../controllers/checkoutController');
const Review = require('../models/Review');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { isLoggedIn, mustCompleteProfile } = require('../middleware/auth');

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

router.get('/', (req, res) => res.redirect('/store'));
router.get('/store', bookController.getAllBooks);
router.get('/store/book/:id', bookController.getBookDetail);
router.get('/search', bookController.searchBooks);

router.get('/cart', cartController.getCart);
router.post('/cart/add/:id', cartController.addToCart);
router.post('/cart/update', cartController.updateCart);
router.get('/cart/delete/:id', cartController.deleteItem);

router.get('/checkout', isLoggedIn, mustCompleteProfile, checkoutController.checkoutCart);
router.post('/checkout', isLoggedIn, mustCompleteProfile, checkoutController.createOrder);

router.get('/review/:id', isLoggedIn, async (req, res) => {
    try {
        const bookId = req.params.id;
        const sessionUser = req.session.user;

        const book = await Book.findById(bookId).lean();
        if (!book) {
            return res.redirect('/auth/profile?error=Asset profile not found.');
        }

        const verifiedPurchase = await Order.findOne({
            user: sessionUser.id,
            status: 'Completed',
            'items.book': bookId
        }).lean();

        if (!verifiedPurchase) {
            return res.redirect(`/store/book/${bookId}?error=Review operational authorization restricted.`);
        }

        const existingReview = await Review.findOne({
            user: sessionUser.id,
            book: bookId
        }).lean();

        if (existingReview) {
            return res.redirect(`/store/book/${bookId}`);
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
        const bookId = req.params.id;
        const sessionUser = req.session.user; 

        const existingReview = await Review.findOne({
            user: sessionUser.id,
            book: bookId
        }).lean();

        if (existingReview) {
            return res.redirect(`/store/book/${bookId}`);
        }

        const { rating, comment } = req.body;

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