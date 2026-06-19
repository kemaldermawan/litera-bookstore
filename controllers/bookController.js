const Book = require('../models/Book');
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.getAllBooks = async (req, res) => {
    try {
        const [
            newArrivals, 
            bestsellers, 
            fiction, 
            nonFiction, 
            selfDevelopment, 
            technology, 
            comic, 
            biography,
            children,
            textbook
        ] = await Promise.all([
            Book.find({}).sort({ createdAt: -1 }).limit(5).lean(),
            Book.find({ salesCount: { $gt: 0 } }).sort({ salesCount: -1 }).limit(5).lean(),
            Book.find({ category: { $regex: '^Fiction$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Non-Fiction$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Self-Development$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Technology & Science$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Comic & Graphic Novel$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Biography & History$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Children & Young Adult$', $options: 'i' } }).limit(5).lean(),
            Book.find({ category: { $regex: '^Textbook & Education$', $options: 'i' } }).limit(5).lean()
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
            selfDevelopment, 
            technology,
            comic,
            biography,
            children,
            textbook,
            user: req.session.user || null,
            success,
            error
        });
    } catch (err) {
        console.error('Critical failure loading bookstore storefront categories:', err);
        res.status(500).send('Internal Server Error compiling storefront catalog views.');
    }
};

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

        let hasPurchased = false;
        let hasReviewed = false;

        if (sessionUser && sessionUser.role === 'user') {
            const purchasedOrder = await Order.findOne({
                user: sessionUser.id,
                status: { $ne: 'Cancelled' },
                'items.book': bookId
            }).lean();
            
            if (purchasedOrder) {
                hasPurchased = true;
            }

            const existingReview = await Review.findOne({
                user: sessionUser.id,
                book: bookId
            }).lean();
            
            if (existingReview) {
                hasReviewed = true;
            }
        }

        res.render('pages/bookDetail', {
            pageTitle: `${book.title} - Litera Bookstore`,
            book,
            relatedBooks,
            reviews,
            user: sessionUser,
            hasPurchased,
            hasReviewed
        });
    } catch (err) {
        console.error('Error compiling asset product details view data:', err);
        res.status(500).send('Internal Server Error fetching resource details.');
    }
};

exports.searchBooks = async (req, res, next) => {
    try {
        const query = req.query.q ? req.query.q.trim() : '';
        const sort = req.query.sort || '';
        const rating = req.query.rating || '';
        
        if (!query) {
            return res.render('pages/searchResult', {
                pageTitle: 'Search Results - Litera Bookstore',
                query: '',
                books: [],
                sort: '',
                rating: ''
            });
        }

        // Map frontend sort parameters to Mongoose sort objects
        let sortOption = {};
        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else if (sort === 'popularity') {
            sortOption = { salesCount: -1 };
        }

        // Build search query conditions
        const findQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        };

        if (rating) {
            const numericRating = Number(rating);
            if (!isNaN(numericRating)) {
                findQuery.averageRating = { $gte: numericRating };
            }
        }

        const books = await Book.find(findQuery).sort(sortOption).lean();

        res.render('pages/searchResult', {
            pageTitle: `Search Results for "${query}" - Litera Bookstore`,
            query: query,
            books: books,
            sort: sort,
            rating: rating
        });
    } catch (error) {
        next(error);
    }
};
