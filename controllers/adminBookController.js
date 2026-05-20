const Book = require('../models/Book');
const Order = require('../models/Order');
const Review = require('../models/Review');

/**
 * Render the main administrative dashboard.
 * Compiles all registered books within the physical store inventory.
 */
exports.getDashboard = async (req, res) => {
    try {
        const books = await Book.find().lean();
        const adminData = req.session.user || null;

        res.render('admin/dashboard', { 
            pageTitle: 'Admin Dashboard - Litera Bookstore',
            books,
            currentUser: adminData,
            user: adminData
        });
    } catch (err) {
        console.error('Critical failure loading administrative dashboard:', err);
        res.status(500).send('Administrative compilation failure. Failed to load dashboard.');
    }
};

/**
 * Render the asset data editor workspace form interface.
 */
exports.getEditBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).lean();
        if (!book) {
            return res.redirect('/admin/dashboard?error=Target book profile not found.');
        }

        res.render('admin/editBook', { 
            pageTitle: `Edit: ${book.title} - Litera Admin`,
            book 
        });
    } catch (err) {
        console.error('Error fetching book target for editing workspace:', err);
        res.redirect('/admin/dashboard?error=Runtime operational exception.');
    }
};

/**
 * Process inbound form payloads to register a brand-new book asset inside MongoDB.
 */
exports.createBook = async (req, res) => {
    try {
        const { title, author, synopsis, price, stock, category } = req.body;
        
        let coverPath = '/img/covers/default.jpg';
        if (req.file) {
            coverPath = `/img/covers/${req.file.filename}`;
        }

        await Book.create({
            title,
            author,
            synopsis,
            price: Number(price),
            stock: Number(stock),
            category,
            coverImage: coverPath
        });

        res.redirect('/admin/dashboard?success=New book asset deployed to shelves successfully.');
    } catch (err) {
        console.error('Critical book asset creation failure sequence:', err);
        res.status(500).send('Internal Server Error creating inventory record.');
    }
};

/**
 * Process configuration updates for an existing book catalog record item.
 */
exports.updateBook = async (req, res) => {
    try {
        const { title, author, synopsis, price, stock, category } = req.body;
        
        const updatedData = {
            title,
            author,
            synopsis,
            price: Number(price),
            stock: Number(stock),
            category
        };

        if (req.file) {
            updatedData.coverImage = `/img/covers/${req.file.filename}`;
        }

        const result = await Book.findByIdAndUpdate(req.params.id, updatedData);
        if (!result) {
            return res.redirect('/admin/dashboard?error=Failed to update. Book profile missing.');
        }

        res.redirect('/admin/dashboard?success=Book configuration matrix synchronized.');
    } catch (err) {
        console.error('Critical exception applying book updates:', err);
        res.status(500).send('Internal Server Error updating inventory records.');
    }
};

/**
 * Evict a designated book document from the library datastore collection.
 */
exports.deleteBook = async (req, res) => {
    try {
        const result = await Book.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.redirect('/admin/dashboard?error=Deletion targeted book not found.');
        }

        res.redirect('/admin/dashboard?success=Book asset dropped from active storage.');
    } catch (err) {
        console.error('Critical exception executing asset deletion command:', err);
        res.redirect('/admin/dashboard?error=Operational erasure protocol failure.');
    }
};

// --- DYNAMIC AJAX DATA STREAM ENDPOINTS (BACKEND API FOR THE ADMIN DASHBOARD) ---

/**
 * Fetch and stream historical order reservation records to feeding AJAX tables.
 */
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Order.find({})
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.json({ success: true, transactions });
    } catch (error) {
        console.error('Error fetching structural order reservation vectors for AJAX pipeline:', error);
        res.status(500).json({ success: false, message: 'Failed to compile transaction ledger streams.' });
    }
};

/**
 * Fetch and stream public user book reviews to feeding data tables.
 */
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'username')
            .populate('book', 'title')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Error compiling product review feeds for AJAX pipeline:', error);
        res.status(500).json({ success: false, message: 'Failed to extract product review stream metrics.' });
    }
};

/**
 * NEW ACTION: Update order status to Completed via Admin Control trigger
 */
exports.completeOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'Completed' }, { new: true });
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order records not found." });
        }
        res.status(200).json({ success: true, message: "Order finalized successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error completing order." });
    }
};

/**
 * NEW ACTION: Delete customer review via Admin moderation panel
 */
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const targetReview = await Review.findByIdAndDelete(reviewId);
        
        if (!targetReview) {
            return res.status(404).json({ success: false, message: "Review listing not found." });
        }
        res.status(200).json({ success: true, message: "Review evicted safely." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error deleting review." });
    }
};