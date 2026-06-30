const Book = require('../models/Book');

exports.getCart = (req, res) => {
    try {
        const cart = req.session.cart || [];

        let subtotal = 0;
        cart.forEach(item => {
            const effectivePrice = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : item.price;
            subtotal += effectivePrice * item.qty;
        });

        const total = subtotal;

        res.render('pages/cart', {
            pageTitle: 'Your Shopping Cart - Litera Bookstore',
            cart,
            subtotal,
            total,
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        console.error('Critical session cart computation exception:', err);
        res.status(500).send('Internal Server Error loading your shopping cart.');
    }
};

exports.addToCart = async (req, res) => {
    try {
        const bookId = req.params.id;
        const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';

        const book = await Book.findById(bookId).lean();
        if (!book) {
            if (isAjax) return res.status(404).json({ success: false, error: 'The selected book profile could not be located.' });
            return res.redirect('/store?error=The selected book profile could not be located.');
        }

        if (book.stock <= 0) {
            if (isAjax) return res.status(400).json({ success: false, error: 'Sorry, this book is currently out of stock.' });
            return res.redirect(`/store/book/${bookId}?error=Sorry, this book is currently out of stock on our shelves.`);
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }
        const cart = req.session.cart;

        const existingItem = cart.find(item => item.bookId === bookId);
        if (existingItem) {
            if (existingItem.qty + 1 > book.stock) {
                if (isAjax) return res.status(400).json({ success: false, error: `Cannot add more items. Only ${book.stock} units available.` });
                return res.redirect('/cart?error=Cannot add more items. Physical shelf inventory limit reached.');
            }
            existingItem.qty += 1;
            // Update prices in case they changed since last add
            existingItem.price = book.price;
            existingItem.discountPrice = book.discountPrice;
        } else {
            cart.push({
                bookId: book._id.toString(),
                title: book.title,
                price: book.price,
                discountPrice: book.discountPrice,
                coverImage: book.coverImage,
                stock: book.stock,
                qty: 1
            });
        }

        req.session.cart = cart;

        const cartCount = cart.reduce((totalItems, currentItem) => totalItems + currentItem.qty, 0);

        if (isAjax) {
            return res.status(200).json({
                success: true,
                message: `"${book.title}" added to your cart successfully.`,
                cartCount: cartCount
            });
        }

        res.redirect('/cart?success=Item added to your shopping cart successfully.');
    } catch (err) {
        console.error('Critical cart item addition operational failure:', err);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(500).json({ success: false, error: 'Failed to process cart allocation sequence.' });
        }
        res.redirect('/store?error=Failed to process cart allocation sequence.');
    }
};

exports.updateCart = async (req, res) => {
    try {
        const quantities = req.body.qty; 
        if (!req.session.cart || !quantities) {
            return res.redirect('/cart');
        }

        for (const item of req.session.cart) {
            const newQty = parseInt(quantities[item.bookId]) || 0;
            if (newQty > 0) {
                const book = await Book.findById(item.bookId).lean();
                if (book && newQty > book.stock) {
                    return res.redirect(`/cart?error=Requested quantity for "${item.title}" exceeds available physical shelf inventory (${book.stock} units available).`);
                }
            }
        }

        req.session.cart = req.session.cart.filter(item => {
            const newQty = parseInt(quantities[item.bookId]) || 0;
            if (newQty <= 0) {
                return false; 
            }
            item.qty = newQty; 
            return true;
        });

        res.redirect('/cart?success=Shopping cart configurations synchronized.');
    } catch (err) {
        console.error('Cart structural adjustment runtime processing exception:', err);
        res.redirect('/cart?error=Failed to apply quantity modifications.');
    }
};

exports.deleteItem = (req, res) => {
    try {
        const bookId = req.params.id;
        if (!req.session.cart) {
            req.session.cart = [];
        }

        req.session.cart = req.session.cart.filter(item => item.bookId !== bookId);

        res.redirect('/cart?success=Item removed from your shopping cart successfully.');
    } catch (err) {
        console.error('Cart item expulsion operational routine failure:', err);
        res.redirect('/cart?error=Failed to remove the selected asset.');
    }
};