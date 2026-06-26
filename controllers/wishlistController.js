const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

exports.getWishlist = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const wishlist = await Wishlist.findOne({ user: userId }).populate("books");
        res.render("pages/wishlist", { 
            wishlist,
            success: req.query.success,
            error: req.query.error,
            info: req.query.info
        });
    } catch (error) {
        console.error(error);
        res.redirect("/store?error=Could not retrieve wishlist.");
    }
};

exports.addBookToWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.session.user.id;
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, books: [] });
        }

        if (!wishlist.books.includes(bookId)) {
            wishlist.books.push(bookId);
            await wishlist.save();
            res.redirect("/store/book/" + bookId + "?success=Book added to wishlist.");
        } else {
            res.redirect("/store/book/" + bookId + "?info=Book is already in your wishlist.");
        }
    } catch (error) {
        console.error(error);
        res.redirect("/store/book/" + req.params.bookId + "?error=Could not add book to wishlist.");
    }
};

exports.removeBookFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.session.user.id;
        const wishlist = await Wishlist.findOne({ user: userId });

        if (wishlist) {
            wishlist.books = wishlist.books.filter(
                (book) => book.toString() !== bookId
            );
            await wishlist.save();
            res.redirect("/wishlist?success=Book removed from wishlist.");
        } else {
            res.redirect("/wishlist?info=Wishlist not found.");
        }
    } catch (error) {
        console.error(error);
        res.redirect("/wishlist?error=Could not remove book from wishlist.");
    }
};
