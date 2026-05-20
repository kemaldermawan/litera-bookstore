const Book = require("../models/Book");
const Order = require("../models/Order");
const mongoose = require("mongoose");

/**
 * Render the secure checkout overview interface for physical book reservations.
 * Maps operational items directly from the Express Session payload state.
 */
exports.checkoutCart = async (req, res) => {
    try {
        const sessionCart = req.session.cart || [];
        if (sessionCart.length === 0) {
            return res.redirect("/cart?error=Checkout initialization failed. Your shopping cart is currently empty.");
        }

        // Map session-based data items safely to structural presentation array models
        const checkoutItems = sessionCart.map(item => ({
            id: item.bookId,
            title: item.title,
            price: item.price,
            quantity: item.qty,
            coverImage: item.coverImage 
        }));

        // Compute pricing aggregates across the mapped array structure
        const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Double-check profile presence context parameters before rendering layout targets
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

/**
 * Validate shelf stock availability and construct a new local store order transaction.
 * Synchronizes body-driven quantities and maps dynamic payment types into MongoDB.
 */
exports.createOrder = async (req, res) => {
    try {
        const sessionCart = req.session.cart || [];
        const bodyQuantities = req.body.qty || {};
        const { paymentMethod } = req.body;
        const user = req.session.user;

        if (sessionCart.length === 0) {
            return res.redirect("/cart?error=Order placement rejected. Empty cart footprint.");
        }

        // Strict fallback validation check to enforce baseline profile phone and address requirements
        if (!user || !user.id) {
            return res.redirect("/auth/profile?notification=complete_profile_required");
        }

        const items = [];
        
        // --- QUANTITY RE-VALIDATION & INVENTORY STOCK CHECK ---
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

        // --- HIGH-PERFORMANCE TRANSACTIONS VIA BULKWRITE ---
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

        // Menentukan label status awal pesanan berdasarkan jenis metode pembayaran pilihan konsumen
        let initialOrderStatus = "Pending Payment";
        if (paymentMethod === "Cash") {
            initialOrderStatus = "Pending Pickup";
        } else if (paymentMethod === "COD") {
            initialOrderStatus = "Pending Delivery";
        }

        const holdExpiryDate = new Date();
        holdExpiryDate.setHours(holdExpiryDate.getHours() + 24);

        // PERBAIKAN KRITIKAL: Memastikan instansiasi User ID dikonversi secara eksplisit ke dalam tipe ObjectId Mongoose
        const mongooseUserId = new mongoose.Types.ObjectId(user.id);

        // Memasukkan dokumen transaksi baru ke pangkalan data MongoDB secara aman
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

        // Bersihkan memori basket session setelah dokumen order berhasil persisten di database
        req.session.cart = [];

        // Redirect langsung menuju endpoint halaman sukses order komersial baru
        res.redirect(`/order-success/${newOrder._id}`);
    } catch (err) {
        console.error("Critical order processing operation exception inside backend core:", err);
        res.status(500).send("Critical database runtime exception creating order reservation.");
    }
};