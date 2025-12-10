const Book = require('../models/Book');

exports.getCart = (req, res) => {
    const cart = req.session.cart || [];

    // Hitung subtotal
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const total = subtotal; // tidak ada ongkir

    res.render('pages/cart', { 
        cart,
        subtotal,
        total
    });
};

exports.addToCart = async (req, res) => {
    const bookId = req.params.id;

    const book = await Book.findById(bookId).lean();
    if (!book) return res.redirect('/');

    // Jika cart belum ada → buat array baru
    if (!req.session.cart) req.session.cart = [];

    const cart = req.session.cart;

    // Apakah buku sudah ada di cart?
    const existingItem = cart.find(item => item.bookId === bookId);

    if (existingItem) {
        existingItem.qty += 1; // tambah quantity
    } else {
        cart.push({
            bookId: book._id,
            title: book.title,
            price: book.price,
            coverImage: book.coverImage,
            qty: 1
        });
    }

    req.session.cart = cart;
    res.redirect('/cart');
};

exports.updateCart = (req, res) => {
    const quantities = req.body.qty; // hasil dari qty[itemId]

    if (!req.session.cart) return res.redirect('/cart');

    req.session.cart = req.session.cart.filter(item => {
        const newQty = parseInt(quantities[item.bookId]) || 0;

        if (newQty <= 0) {
            return false; // hapus item
        }

        item.qty = newQty; // update quantity
        return true;
    });

    res.redirect('/cart');
};

exports.deleteItem = (req, res) => {
    const bookId = req.params.id;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Filter: sisakan item lain, buang item yang ID-nya sesuai
    req.session.cart = req.session.cart.filter(item => item.bookId != bookId);

    res.redirect('/cart');
};

