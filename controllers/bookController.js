const Book = require('../models/Book');
const Review = require('../models/Review');
const Order = require('../models/Order');

/**
 * Fetch and aggregate book collections for the main bookstore storefront.
 */
exports.getAllBooks = async (req, res) => {
    try {
        const [newArrivals, bestsellers, fiction, nonFiction, technology, comic, biography] = await Promise.all([
            Book.find({}).sort({ createdAt: -1 }).limit(5).lean(),
            Book.find({ salesCount: { $gt: 0 } }).sort({ salesCount: -1 }).limit(5).lean(),
            Book.find({ genre: { $regex: '^Fiction$', $options: 'i' } }).limit(5).lean(),
            Book.find({ genre: { $regex: '^Non-Fiction$', $options: 'i' } }).limit(5).lean(),
            Book.find({ genre: { $regex: '^Technology & Science$', $options: 'i' } }).limit(5).lean(),
            Book.find({ genre: { $regex: '^Comic & Graphic Novel$', $options: 'i' } }).limit(5).lean(),
            Book.find({ genre: { $regex: '^Biography & History$', $options: 'i' } }).limit(5).lean()
        ]);

        const success = req.session ? req.session.success : null;
        if (req.session && req.session.success) {
            delete req.session.success;
        }

        const error = req.query.error || null;

        res.render('pages/home', {
            pageTitle: 'Litera Bookstore - Home',
            newArrivals,
            bestsellers,
            fiction,
            nonFiction,
            technology,
            comic,
            biography,
            success,
            error
        });
    } catch (err) {
        console.error('Critical catalogue aggregation failure:', err);
        res.status(500).send('Internal Server Error loading catalog records.');
    }
};

/**
 * Retrieve detailed profiles for a specific book asset.
 * Validates purchase histories to restrict review submission flags.
 */
exports.getBookDetail = async (req, res) => {
    try {
        const bookId = req.params.id;
        const sessionUser = req.session.user || null;

        const book = await Book.findById(bookId).lean();
        if (!book) {
            return res.status(404).send('The requested book listing does not exist.');
        }

        const reviews = await Review.find({ book: bookId })
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .lean();

        const relatedBooks = await Book.find({
            category: book.category,
            _id: { $ne: book._id }
        }).limit(4).lean();

        // VALIDASI EMPIRIS: Memeriksa apakah user aktif sudah pernah membeli buku ini sampai sukses
        let hasPurchased = false;
        if (sessionUser && sessionUser.role === 'user') {
            const completedOrder = await Order.findOne({
                user: sessionUser.id,
                status: 'Completed',
                'items.book': bookId
            }).lean();
            if (completedOrder) {
                hasPurchased = true;
            }
        }

        res.render('pages/bookDetail', {
            pageTitle: `${book.title} - Litera Bookstore`,
            book,
            relatedBooks,
            reviews,
            user: sessionUser,
            hasPurchased
        });
    } catch (err) {
        console.error('Error compiling asset product details view data:', err);
        res.status(500).send('Internal Server Error fetching resource details.');
    }
};

/**
 * Execute text pattern queries across title, author, and genre fields inside MongoDB.
 */
exports.searchBooks = async (req, res, next) => {
    try {
        const query = req.query.q ? req.query.q.trim() : '';
        
        if (!query) {
            return res.render('pages/searchResult', {
                pageTitle: 'Search Results - Litera Bookstore',
                query: '',
                books: []
            });
        }

        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        }).lean();

        res.render('pages/searchResult', {
            pageTitle: `Search Results for "${query}" - Litera Bookstore`,
            query: query,
            books: books
        });
    } catch (error) {
        next(error);
    }
};