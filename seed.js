const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding...');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        await Book.deleteMany({});
        console.log('🧹 Data lama dibersihkan.');

        const booksData = [
            // FIKSI
            { title: "Laskar Pelangi", author: "Andrea Hirata", price: 85000, stock: 10, category: "Fiksi", salesCount: 100, coverImage: "https://placehold.co/400x600?text=Laskar+Pelangi", synopsis: "..." },
            { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", price: 95000, stock: 15, category: "Fiksi", salesCount: 80, coverImage: "https://placehold.co/400x600?text=Bumi+Manusia", synopsis: "..." },
            { title: "Cantik Itu Luka", author: "Eka Kurniawan", price: 90000, stock: 20, category: "Fiksi", salesCount: 35, coverImage: "https://placehold.co/400x600?text=Cantik+Itu+Luka", synopsis: "..." },
            { title: "Pulang", author: "Leila S. Chudori", price: 88000, stock: 12, category: "Fiksi", salesCount: 45, coverImage: "https://placehold.co/400x600?text=Pulang", synopsis: "..." },
            { title: "Laut Bercerita", author: "Leila S. Chudori", price: 92000, stock: 18, category: "Fiksi", salesCount: 90, coverImage: "https://placehold.co/400x600?text=Laut+Bercerita", synopsis: "..." },

            // NON-FIKSI
            { title: "Sebuah Seni untuk Bersikap Bodo Amat", author: "Mark Manson", price: 72000, stock: 25, category: "Non-Fiksi", salesCount: 200, coverImage: "https://placehold.co/400x600?text=Bodo+Amat", synopsis: "..." },
            { title: "Atomic Habits", author: "James Clear", price: 105000, stock: 35, category: "Non-Fiksi", salesCount: 250, coverImage: "https://placehold.co/400x600?text=Atomic+Habits", synopsis: "..." },
            { title: "Filosofi Teras", author: "Henry Manampiring", price: 88000, stock: 40, category: "Non-Fiksi", salesCount: 150, coverImage: "https://placehold.co/400x600?text=Filosofi+Teras", synopsis: "..." },
            { title: "Sapiens", author: "Yuval Noah Harari", price: 115000, stock: 10, category: "Non-Fiksi", salesCount: 120, coverImage: "https://placehold.co/400x600?text=Sapiens", synopsis: "..." },
            { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 130000, stock: 8, category: "Non-Fiksi", salesCount: 60, coverImage: "https://placehold.co/400x600?text=Thinking+Fast", synopsis: "..." },
            
            // KOMIK (Untuk New Arrivals)
            { title: "One Piece 100", author: "Eiichiro Oda", price: 45000, stock: 100, category: "Komik", salesCount: 10, coverImage: "https://placehold.co/400x600?text=One+Piece", synopsis: "..." },
        ];

        await Book.insertMany(booksData);
        console.log(`🎉 Berhasil menambahkan ${booksData.length} buku dummy!`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

seedData();