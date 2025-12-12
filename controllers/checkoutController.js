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

exports.checkoutCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user.id })
        .populate("items.book");

    if (!cart || cart.items.length === 0) {
        return res.redirect("/cart");
    }

    const checkoutItems = cart.items.map(item => ({
        id: item.book._id,
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
        coverImage: item.book.coverImage 
    }));

    const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return res.render("pages/checkout", {
        user: req.session.user,
        isBuyNow: false,
        items: checkoutItems,
        subtotal: total
    });
    
};

exports.createOrder = async (req, res) => {
    const { paymentMethod, isBuyNow } = req.body;
    const user = req.session.user;

    if (!user.address || !user.address.city) {
        return res.redirect("/profile?need=complete-profile");
    }

    let items = [];
    let totalPrice = 0;

    if (isBuyNow === "true") {
        const book = await Book.findById(req.body.bookId);
        items.push({
            book: book._id,
            quantity: 1,
            priceAtPurchase: book.price
        });
        totalPrice = book.price;

    } else {
        const cart = await Cart.findOne({ user: user.id }).populate("items.book");
        items = cart.items.map(item => ({
            book: item.book._id,
            quantity: item.quantity,
            priceAtPurchase: item.book.price
        }));
        totalPrice = items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);

        await Cart.findOneAndDelete({ user: user.id });
    }

    const newOrder = await Order.create({
        user: user.id,
        items,
        totalPrice,
        paymentMethod,
        shippingAddress: {
            ...user.address,
            phone: user.phone
        }
    });

    // 🔥 ARAHKAN KE /order-success/:orderId
    res.redirect(`/order-success/${newOrder._id}`);
};


