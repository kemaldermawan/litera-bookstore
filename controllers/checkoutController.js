const Book = require("../models/Book");
const Cart = require("../models/cart");
const Order = require("../models/Order");

exports.buyNow = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const book = await Book.findById(bookId);
        if (!book) return res.redirect("/");

        const items = [
            {
                id: book._id,
                title: book.title,
                price: book.price,
                quantity: 1,
                coverImage: book.coverImage
            }
        ];

        const subtotal = book.price;

        return res.render("pages/checkout", {
            user: req.session.user,
            items,
            subtotal,
            isBuyNow: true
        });

    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
};

// checkoutController.js

exports.checkoutCart = async (req, res) => {
    // GANTI: Ambil dari Sesi, bukan MongoDB. (Seperti yang dilakukan cartController.js)
    const sessionCart = req.session.cart || [];

    if (sessionCart.length === 0) {
        return res.redirect("/cart"); // Keranjang sesi kosong
    }

    // Karena item di sesi sudah berisi data lengkap (title, price, dll),
    // kita tidak perlu populate, kita hanya memetakan strukturnya.

    const checkoutItems = sessionCart.map(item => ({
        id: item.bookId, // bookId dari sesi menjadi id untuk checkout.ejs
        title: item.title,
        price: item.price,
        quantity: item.qty, // qty dari sesi menjadi quantity untuk checkout.ejs
        coverImage: item.coverImage 
    }));

    const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Periksa untuk memastikan variabel `user` ada sebelum merender
    if (!req.session.user) {
        return res.redirect("/login");
    }

    return res.render("pages/checkout", {
        user: req.session.user,
        isBuyNow: false,
        items: checkoutItems,
        subtotal: subtotal
    });
};

// checkoutController.js

exports.createOrder = async (req, res) => {
    const { paymentMethod, isBuyNow, bookId } = req.body;
    const user = req.session.user;

    // Periksa user dan address (Wajib Lolos Middleware)
    if (!user || !user.id || !user.address || !user.address.city || !user.phone) {
        return res.redirect("/profile?need=complete-profile");
    }

    let items = [];
    let totalPrice = 0;

    if (isBuyNow === "true") {
        // --- LOGIC UNTUK BUY NOW ---
        const book = await Book.findById(bookId);
        if (!book) return res.redirect("/");

        items.push({
            book: book._id,
            quantity: 1,
            priceAtPurchase: book.price
        });
        totalPrice = book.price;

    } else {
        // --- LOGIC UNTUK CHECKOUT DARI CART SESSION ---
        const sessionCart = req.session.cart || [];

        if (sessionCart.length === 0) {
            return res.redirect("/cart?error=empty-cart");
        }
        
        items = sessionCart.map(item => ({
            book: item.bookId,
            quantity: item.qty,
            priceAtPurchase: item.price
        }));
        
        totalPrice = items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);

        // **PENTING: Jangan hapus keranjang sesi di sini dulu, kita butuh datanya untuk update salesCount**
        // req.session.cart = []; // Kita pindahkan ini ke bawah
    }
    
    if (totalPrice <= 0) {
        return res.redirect("/cart?error=zero-price"); 
    }

    // ==========================================================
    // 🔥🔥 BAGIAN BARU: UPDATE SALES COUNT 🔥🔥
    // ==========================================================

    const bulkUpdateOperations = items.map(item => ({
        updateOne: {
            filter: { _id: item.book },
            // $inc digunakan untuk menaikkan nilai field yang ada
            update: { $inc: { salesCount: item.quantity } } 
            // Kita naikkan salesCount sejumlah quantity buku yang dibeli
        }
    }));

    // Gunakan Book.bulkWrite untuk update semua buku dalam satu operasi batch
    if (bulkUpdateOperations.length > 0) {
        await Book.bulkWrite(bulkUpdateOperations);
    }
    
    // ==========================================================
    // 🔥🔥 END OF UPDATE SALES COUNT 🔥🔥
    // ==========================================================

    // Jika order berhasil, baru hapus keranjang sesi
    if (isBuyNow !== "true") {
         req.session.cart = [];
    }

    // Buat Order baru dengan semua field REQUIRED
    const newOrder = await Order.create({
        user: user.id,
        items,
        totalPrice,
        paymentMethod,
        shippingAddress: {
            street: user.address.street,
            city: user.address.city,
            province: user.address.province,
            postalCode: user.address.postalCode,
            phone: user.phone
        }
    });

    res.redirect(`/order-success/${newOrder._id}`);
};