const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const { isLoggedIn } = require('../middleware/auth');

// FORM review
router.get('/review/:bookId', isLoggedIn, async (req, res) => {
  const book = await Book.findById(req.params.bookId).lean();
  if (!book) return res.redirect('/');
  res.render('pages/review', { book });
});

// SUBMIT review
router.post('/review/:bookId', isLoggedIn, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;

    // ambil user dari session/middleware
    const user = req.user || req.session.user;
    if (!user) return res.redirect('/login');

    const newReview = new Review({
      book: bookId,
      user: user.id || user._id,
      username: user.username,
      rating: Number(rating),
      comment
    });

    await newReview.save();

    // Update jumlah ulasan & average rating di Book
    const reviews = await Review.find({ book: bookId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (numReviews || 1);

    await Book.findByIdAndUpdate(bookId, {
      numReviews,
      averageRating: Math.round(avgRating * 10) / 10 // 1 decimal
    });

    res.redirect(`/store/book/${bookId}`);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).send("Error saving review");
  }
});

module.exports = router;

