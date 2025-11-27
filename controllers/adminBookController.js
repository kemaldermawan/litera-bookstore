const Book = require('../models/Book');
const path = require('path');

module.exports = {

    // Dashboard
    getDashboard: async (req, res) => {
        const books = await Book.find().lean();
        res.render('admin/dashboard', { books });
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

            // kalau user upload cover baru
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
    }
};

