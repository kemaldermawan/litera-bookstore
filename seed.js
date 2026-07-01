const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('Environmental parameter MONGO_URI is not defined inside the configurations.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected successfully for inventory seeding operations...');
    } catch (err) {
        console.error('❌ Database connection alignment failed:', err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        const booksData = [

        ];
    } catch (error) {
        console.error('❌ Error executing database seeding commands:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection stream safely closed.');
    }
};

seedData();