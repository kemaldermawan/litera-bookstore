const express = require("express");
const router = express.Router();
// PASTIKAN path ini benar.
const Book = require("../models/Book"); 

router.get("/", async (req, res) => {
    try {
        console.log("--- Mencoba mengambil data buku dari DB ---");
        const books = await Book.find().lean(); // Gunakan .lean() untuk data read-only
        
        // LOG KRITIS: Cek apakah books kosong atau ada isinya
        if (books.length === 0) {
            console.log("ALERT: Query Book.find() mengembalikan array KOSONG.");
            console.log("Mohon cek: 1. Nama database di MONGO_URI, 2. Nama koleksi di Mongoose Model.");
        } else {
            console.log(`SUCCESS: Ditemukan ${books.length} buku.`);
        }

        res.render("pages/home", { books });
    } catch (error) {
        console.error("ERROR saat memuat buku di home page:", error);
        res.render("pages/home", { books: [] }); // Pastikan template tetap bisa di-render
    }
});

// router.get("/:id", async (req, res) => {
//     try {
//         const book = await Book.findById(req.params.id).lean();
//         if (!book) return res.status(404).send("Book not found");

//         res.render("pages/bookDetail", { book });
//     } catch (err) {
//         console.error("Error fetching book detail:", err);
//         res.status(500).send("Error loading detail");
//     }
// });

module.exports = router;