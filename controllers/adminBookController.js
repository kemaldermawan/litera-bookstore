const Book = require('../models/Book');
const path = require('path');
const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require('../models/User'); // Pastikan User model diimpor untuk populate

module.exports = {

    // -----------------------------------------------------
    // A. FUNGSI UTAMA (Manajemen Buku)
    // -----------------------------------------------------

    // Dashboard - Menampilkan daftar buku dan halaman admin utama
    getDashboard: async (req, res) => {
        try {
            const books = await Book.find().lean();
            // Asumsi file EJS Anda ada di views/admin/dashboard.ejs
            res.render('admin/dashboard', { books });
        } catch (err) {
            console.error("Error loading dashboard:", err);
            res.status(500).send("Gagal memuat dashboard.");
        }
    },

    // Form edit
    getEditBook: async (req, res) => {
        const book = await Book.findById(req.params.id).lean();
        res.render('admin/editBook', { book });
    },

    // Create Book
    createBook: async (req, res) => {
        try {
            const { judul, penulis, sinopsis, harga, stok, kategori } = req.body;

            let coverPath = "/img/covers/default.jpg";

            if (req.file) {
                coverPath = "/img/covers/" + req.file.filename;
            }

            await Book.create({
                title: judul,
                author: penulis,
                synopsis: sinopsis,
                price: harga,
                stock: stok,
                category: kategori,
                coverImage: coverPath
            });

            res.redirect('/admin/books');
        } catch (err) {
            console.log(err);
            res.status(500).send("Error creating book");
        }
    },

    // Update Book
    updateBook: async (req, res) => {
        try {
            const { judul, penulis, sinopsis, harga, stok, kategori } = req.body;

            const updatedData = {
                title: judul,
                author: penulis,
                synopsis: sinopsis,
                price: harga,
                stock: stok,
                category: kategori,
            };

            if (req.file) {
                updatedData.coverImage = "/img/covers/" + req.file.filename;
            }

            await Book.findByIdAndUpdate(req.params.id, updatedData);

            res.redirect('/admin/books');
        } catch (err) {
            console.log(err);
            res.status(500).send("Error updating book");
        }
    },

    // Delete
    deleteBook: async (req, res) => {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/admin/books');
    },

    // -----------------------------------------------------
    // B. FUNGSI DATA DINAMIS (Untuk AJAX)
    // -----------------------------------------------------

    // 1. Ambil data Transaksi
    getTransactions: async (req, res) => {
        try {
            const transactions = await Order.find({})
                .populate('user', 'username') // Mengambil username
                .sort({ createdAt: -1 });

            // Mengirim data sebagai JSON untuk diolah JS di frontend
            res.json({ success: true, transactions });
        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({ success: false, message: "Gagal memuat data transaksi." });
        }
    },

    // 2. Ambil data Review
    getReviews: async (req, res) => {
        try {
            const reviews = await Review.find({})
                .populate('user', 'username') // Mengambil username
                .populate('book', 'title') // Mengambil judul buku
                .sort({ createdAt: -1 });

            // Mengirim data sebagai JSON untuk diolah JS di frontend
            res.json({ success: true, reviews });
        } catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).json({ success: false, message: "Gagal memuat data review." });
        }
    }
};