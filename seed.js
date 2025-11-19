const mongoose = require('mongoose');
const dotenv = require('dotenv'); 

// Panggil konfigurasi dotenv untuk memuat MONGO_URI
dotenv.config();

// SESUAIKAN PATH INI jika Model Anda tidak berada di ./models/Book.js
const Book = require('./models/Book'); 

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    if (!MONGO_URI) {
        console.error("❌ ERROR: MONGO_URI tidak ditemukan di file .env.");
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding...');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        // Hapus data lama untuk memastikan penulisan baru berhasil
        await Book.deleteMany({});
        console.log('Existing books cleared from the collection.');

        // DEFINISI 10 DATA BUKU
        const booksData = [
            {
                title: "Laskar Pelangi",
                author: "Andrea Hirata",
                synopsis: "Kisah inspiratif perjuangan anak-anak Belitung dalam meraih mimpi di tengah keterbatasan.",
                price: 85000,
                coverImage: "/img/covers/laskar_pelangi.jpg", 
                stock: 10,
                category: "Fiksi",
                salesCount: 18,
                averageRating: 4.8,
                numReviews: 25
            },
            {
                title: "Bumi Manusia",
                author: "Pramoedya Ananta Toer",
                synopsis: "Epos monumental tentang perjuangan martabat pribumi di tengah masa kolonial Belanda.",
                price: 95000,
                coverImage: "/img/covers/bumi_manusia.jpg",
                stock: 15,
                category: "Fiksi",
                salesCount: 30,
                averageRating: 4.9,
                numReviews: 40
            },
            {
                title: "Sebuah Seni untuk Bersikap Bodo Amat",
                author: "Mark Manson",
                synopsis: "Buku pengembangan diri yang mengajarkan kita untuk memilih hal-hal yang benar-benar penting.",
                price: 72000,
                coverImage: "/img/covers/bodo_amat.jpg",
                stock: 25,
                category: "Non-Fiksi",
                salesCount: 50,
                averageRating: 4.7,
                numReviews: 60
            },
            {
                title: "Atomic Habits",
                author: "James Clear",
                synopsis: "Panduan praktis dan teruji untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk.",
                price: 105000,
                coverImage: "/img/covers/atomic_habits.jpg",
                stock: 35,
                category: "Non-Fiksi",
                salesCount: 70,
                averageRating: 4.9,
                numReviews: 85
            },
            {
                title: "Petualangan Tintin: Rahasia Unicorn",
                author: "Hergé",
                synopsis: "Tintin dan Kapten Haddock memulai petualangan untuk mencari harta karun keluarga Haddock.",
                price: 55000,
                coverImage: "/img/covers/tintin_unicorn.jpg",
                stock: 50,
                category: "Komik",
                salesCount: 45,
                averageRating: 4.6,
                numReviews: 30
            },
            {
                title: "Biografi Gus Dur: The Authorized Biography",
                author: "Greg Barton",
                synopsis: "Kisah lengkap perjalanan hidup dan pemikiran Abdurrahman Wahid.",
                price: 120000,
                coverImage: "/img/covers/gus_dur_bio.jpg",
                stock: 8,
                category: "Biografi",
                salesCount: 12,
                averageRating: 4.8,
                numReviews: 15
            },
            {
                title: "Kancil dan Buaya",
                author: "Anonim",
                synopsis: "Kumpulan cerita rakyat tentang kecerdikan Kancil menghadapi buaya.",
                price: 45000,
                coverImage: "/img/covers/kancil_buaya.jpg",
                stock: 60,
                category: "Anak-Anak",
                salesCount: 80,
                averageRating: 4.5,
                numReviews: 55
            },
            {
                title: "Matematika Diskrit dan Aplikasinya",
                author: "Kenneth H. Rosen",
                synopsis: "Buku teks komprehensif untuk mahasiswa teknik dan ilmu komputer.",
                price: 155000,
                coverImage: "/img/covers/mat_diskrit.jpg",
                stock: 12,
                category: "Edukasi",
                salesCount: 5,
                averageRating: 4.4,
                numReviews: 10
            },
            {
                title: "Cantik Itu Luka",
                author: "Eka Kurniawan",
                synopsis: "Kisah magis dan kelam tentang hantu, pelacur, dan sejarah Indonesia.",
                price: 90000,
                coverImage: "/img/covers/cantik_luka.jpg",
                stock: 20,
                category: "Fiksi",
                salesCount: 35,
                averageRating: 4.7,
                numReviews: 50
            },
            {
                title: "Filosofi Teras",
                author: "Henry Manampiring",
                synopsis: "Panduan praktis filosofi Stoa kuno untuk kehidupan modern yang penuh tekanan.",
                price: 88000,
                coverImage: "/img/covers/filosofi_teras.jpg",
                stock: 40,
                category: "Non-Fiksi",
                salesCount: 65,
                averageRating: 4.9,
                numReviews: 95
            }
        ];

        await Book.insertMany(booksData);
        console.log(`🎉 Initial books successfully added! (${booksData.length} documents)`);
        
    } catch (error) {
        console.error('❌ Error during seeding or data insertion:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed. Skrip Selesai.');
    }
};

// Jalankan fungsi utama
seedData();