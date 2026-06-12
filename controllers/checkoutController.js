const Book = require("../models/Book");
const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.checkoutCart = async (req, res) => {
    try {
        const sessionCart = req.session.cart || [];
        if (sessionCart.length === 0) {
            return res.redirect("/cart?error=Checkout initialization failed. Your shopping cart is currently empty.");
        }

        const checkoutItems = sessionCart.map(item => ({
            id: item.bookId,
            title: item.title,
            price: item.price,
            quantity: item.qty,
            coverImage: item.coverImage 
        }));

        const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (!req.session.user) {
            return res.redirect("/auth/login?error=Session timeout. Please sign in again.");
        }

        return res.render("pages/checkout", {
            pageTitle: "Secure Checkout - Litera Bookstore",
            user: req.session.user,
            items: checkoutItems,
            subtotal,
            isBuyNow: false
        });
    } catch (err) {
        console.error("Critical checkout view generation failure:", err);
        res.redirect("/cart?error=Internal error preparing checkout parameters.");
    }
};

exports.createOrder = async (req, res) => {
    try {
        const sessionCart = req.session.cart || [];
        const bodyQuantities = req.body.qty || {};
        const { paymentMethod } = req.body;
        const user = req.session.user;

        if (sessionCart.length === 0) {
            return res.redirect("/cart?error=Order placement rejected. Empty cart footprint.");
        }

        if (!user || !user.id) {
            return res.redirect("/auth/profile?notification=complete_profile_required");
        }

        const items = [];
        
        for (const item of sessionCart) {
            const finalQty = bodyQuantities[item.bookId] ? parseInt(bodyQuantities[item.bookId]) : item.qty;
            
            const currentBook = await Book.findById(item.bookId);
            if (!currentBook) {
                return res.redirect("/cart?error=One or more items in your cart do not exist in our library.");
            }
            if (currentBook.stock < finalQty) {
                return res.redirect(`/cart?error=Reservation failed. "${item.title}" only has ${currentBook.stock} units available.`);
            }

            items.push({
                book: item.bookId,
                quantity: finalQty,
                priceAtPurchase: item.price
            });
        }

        const totalPrice = items.reduce((sum, i) => sum + (i.priceAtPurchase * i.quantity), 0);
        if (totalPrice <= 0) {
            return res.redirect("/cart?error=Order processing blocked due to structural calculation errors.");
        }

        const bulkUpdateOperations = items.map(item => ({
            updateOne: {
                filter: { _id: item.book },
                update: { 
                    $inc: { 
                        stock: -item.quantity, 
                        salesCount: item.quantity 
                    } 
                }
            }
        }));

        if (bulkUpdateOperations.length > 0) {
            await Book.bulkWrite(bulkUpdateOperations);
        }

        let initialOrderStatus = "Pending Payment";
        if (paymentMethod === "Cash") {
            initialOrderStatus = "Pending Pickup";
        } else if (paymentMethod === "COD") {
            initialOrderStatus = "Pending Delivery";
        }

        const holdExpiryDate = new Date();
        holdExpiryDate.setHours(holdExpiryDate.getHours() + 24);

        const mongooseUserId = new mongoose.Types.ObjectId(user.id);

        const newOrder = await Order.create({
            user: mongooseUserId,
            items,
            totalPrice,
            paymentMethod: paymentMethod || "Cash",
            pickupDetails: {
                pickupStore: "Litera Main HQ Branch",
                reservationExpiry: holdExpiryDate
            },
            status: initialOrderStatus
        });

        req.session.cart = [];

        res.redirect(`/order-success/${newOrder._id}`);
    } catch (err) {
        console.error("Critical order processing operation exception inside backend core:", err);
        res.status(500).send("Critical database runtime exception creating order reservation.");
    }
};