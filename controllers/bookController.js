const Book = require('../models/Book');

module.exports = {
    
    // 1. Fungsi untuk Halaman Utama (Homepage)
    getAllBooks: async (req, res) => {
        try {
            // Mengambil data secara paralel untuk efisiensi
            const [newArrivals, bestsellers, fiction, nonFiction, scifi, mystery, biography] = await Promise.all([
                
                // New Arrivals: Ambil semua buku, urutkan dari yang terbaru
                Book.find({}).sort({ createdAt: -1 }).limit(5).lean(),
                
                // Bestsellers: Ambil buku yang sudah terjual
                Book.find({ salesCount: { $gt: 0 } }).sort({ salesCount: -1 }).limit(5).lean(),

                // Kategori Spesifik (Menggunakan Regex agar case-insensitive)
                // Contoh: Mencari 'Fiksi' akan cocok dengan 'fiksi', 'FIKSI', 'Literary & General Fiction', dll.
                Book.find({ category: { $regex: 'Fiksi|Fiction', $options: 'i' } }).limit(5).lean(),
                Book.find({ category: { $regex: 'Non-Fiksi|Non-Fiction', $options: 'i' } }).limit(5).lean(),
                Book.find({ category: { $regex: 'Sci-Fi|Fantasi|Fantasy', $options: 'i' } }).limit(5).lean(),
                Book.find({ category: { $regex: 'Misteri|Mystery|Thriller', $options: 'i' } }).limit(5).lean(),
                Book.find({ category: { $regex: 'Biografi|Biography', $options: 'i' } }).limit(5).lean()
            ]);

            res.render('pages/home', {
                pageTitle: 'Litera Bookstore',
                newArrivals,
                bestsellers,
                fiction,
                nonFiction,
                scifi,
                mystery,
                biography,
                user: req.session.user || null 
            });

        } catch (err) {
            console.error("Error getting books:", err);
            // Render halaman kosong jika error agar server tidak crash
            res.render('pages/home', { 
                pageTitle: 'Litera Bookstore',
                newArrivals: [], bestsellers: [], fiction: [], 
                nonFiction: [], scifi: [], mystery: [], biography: [],
                user: null
            });
        }
    },

    // 2. Fungsi untuk Halaman Detail Buku
    getBookDetail: async (req, res) => {
        try {
            const bookId = req.params.id;
            
            // Cari buku berdasarkan ID
            const book = await Book.findById(bookId).lean();

            if (!book) {
                return res.status(404).send("Buku tidak ditemukan");
            }

            const relatedBooks = await Book.find({
                category: book.category,
                _id: { $ne: book._id } 
            }).limit(4).lean();

            res.render('pages/bookDetail', { 
                pageTitle: book.title,
                book: book,
                relatedBooks: relatedBooks,
                user: req.session.user || null 
            });

        } catch (err) {
            console.error("Error getting book detail:", err);
            res.redirect('/store');
        }
    },

    searchBooks: async (req, res) => {
        try {
            const q = req.query.q;
    
            if (!q) {
                return res.redirect('/');
            }
    
            const books = await Book.find({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { author: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } }
                ]
            }).lean();
    
            res.render('pages/searchResult', {
                pageTitle: `Hasil pencarian: ${q}`,
                books,
                keyword: q,
                user: req.session.user || null
            });
    
        } catch (err) {
            console.error("Error search:", err);
            res.redirect('/');
        }
    },    
};

